import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import api from "../api/Axios.jsx";
import { CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react";

export default function Payment({ setShowAuth }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("pending");
    const [syncing, setSyncing] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [shouldPoll, setShouldPoll] = useState(true);
    const isLoggedIn = !!localStorage.getItem("user_token");

    const checkPaymentStatus = async (externalId) => {
        try {
            setSyncing(true);
            setErrorMsg("");
            const syncRes = await api.post(`/api/payments/sync/${externalId}`);
            if (syncRes.data?.success && syncRes.data?.data) {
                const newStatus = syncRes.data.data.status;
                setStatus(newStatus);
                
                // Stop polling if status is final
                const finalStatuses = ["PAID", "SETTLED", "EXPIRED"];
                if (finalStatuses.includes(newStatus?.toUpperCase())) {
                    setShouldPoll(false);
                }
                return;
            }
        } catch (err) {
            setErrorMsg(err?.response?.data?.message || err?.message || "Gagal sinkron status");
            try {
                const url = paymentData?.invoiceUrl || "";
                const m = url.match(/invoices\/([^/?#]+)/i);
                const xenditId = m?.[1];
                if (xenditId) {
                    const res = await api.get(`/api/payments/sync-by-xendit/${xenditId}`);
                    if (res.data?.success && res.data?.data) {
                        const newStatus = res.data.data.status;
                        setStatus(newStatus);
                        setErrorMsg("");
                        
                        // Stop polling if status is final
                        const finalStatuses = ["PAID", "SETTLED", "EXPIRED"];
                        if (finalStatuses.includes(newStatus?.toUpperCase())) {
                            setShouldPoll(false);
                        }
                        return;
                    }
                }
                const res2 = await api.get(`/api/payments/${externalId}`);
                if (res2.data?.success && res2.data?.data) {
                    setStatus(res2.data.data.status);
                    setErrorMsg("");
                }
            } catch (error) {
                console.error("Error checking payment status:", error);
                setErrorMsg("Gagal memeriksa status pembayaran");
            }
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
            return;
        }

        const { invoiceUrl, externalId, amount, status: initialStatus } = location.state || {};
        
        if (!invoiceUrl || !externalId) {
            navigate("/keranjang");
            return;
        }

        setPaymentData({ invoiceUrl, externalId, amount, status: initialStatus || "pending" });
        setStatus(initialStatus || "pending");
        setLoading(false);

        // Only poll if status is not final (PAID, SETTLED, EXPIRED)
        const finalStatuses = ["PAID", "SETTLED", "EXPIRED"];
        if (!finalStatuses.includes(initialStatus?.toUpperCase())) {
            setShouldPoll(true);
        } else {
            setShouldPoll(false);
        }
    }, [isLoggedIn, navigate]);

    // Separate effect for polling that depends on shouldPoll
    useEffect(() => {
        if (!shouldPoll || !paymentData?.externalId) return;

        const interval = setInterval(() => {
            checkPaymentStatus(paymentData.externalId);
        }, 3000);

        return () => clearInterval(interval);
    }, [shouldPoll, paymentData?.externalId]);

    // ✅ REMOVED: Auto-clear cart - let backend handle cart clearing after order creation
    // Backend will clear cart in PesananService.createOrderFromPayment() after order is saved
    useEffect(() => {
        // When status becomes PAID, just trigger cart badge refresh after a delay
        // to give backend time to process the order and clear cart
        if (status === "PAID" || status === "SETTLED") {
            const timer = setTimeout(() => {
                window.dispatchEvent(new Event("cart:update"));
            }, 2000); // 2 second delay for backend to process
            
            return () => clearTimeout(timer);
        }
    }, [status]);

    const formatPrice = (val) => {
        if (typeof val !== "number") return val;
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(val);
    };

    const getStatusIcon = () => {
        switch (status) {
            case "PAID":
            case "SETTLED":
                return <CheckCircle className="w-14 h-14 text-green-500" />;
            case "EXPIRED":
                return <XCircle className="w-14 h-14 text-red-500" />;
            default:
                return <Clock className="w-14 h-14 text-amber-500 animate-pulse" />;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case "PAID":
            case "SETTLED":
                return { title: "Pembayaran Berhasil!", desc: "Terima kasih, pesanan Anda sedang diproses", color: "text-green-600 dark:text-green-400" };
            case "EXPIRED":
                return { title: "Pembayaran Kadaluarsa", desc: "Invoice telah melewati batas waktu", color: "text-red-600 dark:text-red-400" };
            default:
                return { title: "Menunggu Pembayaran", desc: "Silakan selesaikan pembayaran", color: "text-amber-600 dark:text-amber-400" };
        }
    };

    if (!isLoggedIn) return null;

    if (loading) {
        return (
            <>
                <Header setShowAuth={setShowAuth} />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 dark:border-amber-500 border-t-transparent mx-auto" />
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat data pembayaran...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const statusInfo = getStatusText();

    return (
        <>
            <Header setShowAuth={setShowAuth} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
                        {/* Status Icon */}
                        <div className="flex justify-center mb-6">
                            {getStatusIcon()}
                        </div>

                        {/* Status Text */}
                        <div className="text-center mb-8">
                            <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${statusInfo.color}`}>
                                {statusInfo.title}
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                                {statusInfo.desc}
                            </p>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-5 mb-8">
                            <div className="space-y-4 text-sm md:text-base">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">ID Transaksi</span>
                                    <span className="font-mono font-medium text-gray-900 dark:text-gray-100">
                                        {paymentData?.externalId}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Total Pembayaran</span>
                                    <span className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-500">
                                        {formatPrice(paymentData?.amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                                    <span className={`font-semibold ${
                                        status === "PAID" || status === "SETTLED" ? "text-green-600 dark:text-green-400" :
                                        status === "EXPIRED" ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"
                                    }`}>
                                        {status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions for PENDING */}
                        {status === "PENDING" && (
                            <div className="space-y-4">
                                <a
                                    href={paymentData?.invoiceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white py-3.5 rounded-xl font-bold text-base md:text-lg transition flex items-center justify-center gap-2 shadow-md"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    Buka Halaman Pembayaran
                                </a>

                                <button
                                    onClick={() => checkPaymentStatus(paymentData?.externalId)}
                                    disabled={syncing}
                                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white py-3.5 rounded-xl font-bold text-base md:text-lg transition disabled:bg-gray-400 dark:disabled:bg-gray-600 flex items-center justify-center gap-2 shadow-md"
                                >
                                    {syncing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                            Memeriksa...
                                        </>
                                    ) : (
                                        <>🔄 Refresh Status</>
                                    )}
                                </button>

                                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center">
                                    Sudah bayar? Klik Refresh untuk update status
                                </p>

                                {errorMsg && (
                                    <p className="text-xs md:text-sm text-red-600 dark:text-red-400 text-center">
                                        {errorMsg}
                                    </p>
                                )}

                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-6">
                                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-400 dark:border-gray-500 border-t-transparent" />
                                    Update otomatis setiap 3 detik
                                </div>
                            </div>
                        )}

                        {/* Actions for PAID/SETTLED */}
                        {(status === "PAID" || status === "SETTLED") && (
                            <div className="space-y-4">
                                <div className="bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-800 rounded-xl p-4 text-center">
                                    <p className="text-green-700 dark:text-green-400 font-semibold">🎉 Selamat! Pembayaran berhasil</p>
                                    <p className="text-xs md:text-sm text-green-600 dark:text-green-500 mt-1">
                                        Pesanan Anda akan segera diproses
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate("/")}
                                    className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white py-3.5 rounded-xl font-bold text-base md:text-lg transition shadow-md"
                                >
                                    Kembali ke Beranda
                                </button>
                                <button
                                    onClick={() => navigate("/payment-history")}
                                    className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-3.5 rounded-xl font-bold text-base md:text-lg transition shadow-md"
                                >
                                    Lihat Riwayat Pembayaran
                                </button>
                            </div>
                        )}

                        {/* Actions for EXPIRED */}
                        {status === "EXPIRED" && (
                            <button
                                onClick={() => navigate("/keranjang")}
                                className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white py-3.5 rounded-xl font-bold text-base md:text-lg transition shadow-md"
                            >
                                Kembali ke Keranjang
                            </button>
                        )}
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Butuh bantuan?{" "}
                            <a href="#" className="text-amber-600 dark:text-amber-400 hover:underline font-semibold">
                                Hubungi Kami
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}