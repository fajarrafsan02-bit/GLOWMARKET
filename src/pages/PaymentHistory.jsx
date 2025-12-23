import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import api from "../api/Axios.jsx";
import { Receipt, Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react";

export default function PaymentHistory({ setShowAuth }) {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const isLoggedIn = !!localStorage.getItem("user_token");

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
            return;
        }
        loadPaymentHistory();
    }, [isLoggedIn]);

    const loadPaymentHistory = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("user_token");
            const res = await api.get("/api/payments/user/history", {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const arr = Array.isArray(res.data?.data) ? res.data.data : [];
            setPayments(arr);
        } catch (err) {
            const msg = err.response?.data?.message || "Gagal memuat riwayat pembayaran";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (val) => {
        if (typeof val !== "number") return val;
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(val);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: {
                icon: <Clock className="w-4 h-4" />,
                bg: "bg-amber-100",
                text: "text-amber-700",
                label: "Menunggu"
            },
            PAID: {
                icon: <CheckCircle className="w-4 h-4" />,
                bg: "bg-green-100",
                text: "text-green-700",
                label: "Berhasil"
            },
            SETTLED: {
                icon: <CheckCircle className="w-4 h-4" />,
                bg: "bg-green-100",
                text: "text-green-700",
                label: "Selesai"
            },
            EXPIRED: {
                icon: <XCircle className="w-4 h-4" />,
                bg: "bg-red-100",
                text: "text-red-700",
                label: "Kadaluarsa"
            }
        };

        const badge = badges[status] || badges.PENDING;
        
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
                {badge.icon}
                {badge.label}
            </span>
        );
    };

    if (!isLoggedIn) return null;

    return (
        <>
            <Header setShowAuth={setShowAuth} />

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
                    <Receipt className="inline-block w-10 h-10 mr-3 text-amber-600" />
                    Riwayat Pembayaran
                </h1>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mx-auto" />
                        <p className="mt-4 text-gray-600">Memuat riwayat pembayaran...</p>
                    </div>
                ) : payments.length === 0 ? (
                    <div className="text-center py-20">
                        <Receipt className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <p className="text-xl text-gray-600 mb-8">Belum ada riwayat pembayaran</p>
                        <button
                            onClick={() => navigate("/katalog")}
                            className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700"
                        >
                            Mulai Belanja
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {payments.map((payment) => (
                            <div key={payment.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Payment Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {payment.description || "Pembelian Produk"}
                                            </h3>
                                            {getStatusBadge(payment.status)}
                                        </div>
                                        
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>ID: <span className="font-mono">{payment.externalId}</span></p>
                                            <p>Tanggal: {formatDate(payment.createdAt)}</p>
                                            {payment.paidAt && (
                                                <p>Dibayar: {formatDate(payment.paidAt)}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Amount & Actions */}
                                    <div className="flex flex-col items-end gap-3">
                                        <p className="text-2xl font-bold text-amber-600">
                                            {formatPrice(payment.amount)}
                                        </p>
                                        
                                        <div className="flex gap-2">
                                            {payment.status === "PENDING" && payment.invoiceUrl && (
                                                <a
                                                    href={payment.invoiceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    Bayar
                                                </a>
                                            )}
                                            <button
                                                onClick={() => navigate("/payment", {
                                                    state: {
                                                        invoiceUrl: payment.invoiceUrl,
                                                        externalId: payment.externalId,
                                                        amount: payment.amount,
                                                        status: payment.status
                                                    }
                                                })}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                                            >
                                                Detail
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                {payment.paymentMethod && (
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-sm text-gray-600">
                                            Metode: <span className="font-semibold">{payment.paymentMethod}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}
