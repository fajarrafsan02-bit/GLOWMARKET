import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import api from "../api/Axios.jsx";
import {
    Package, Truck, CheckCircle, Clock, MapPin, Shield,
    CreditCard, ChevronLeft, Navigation, MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function DetailPesanan() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userAddr, setUserAddr] = useState(null);
    console.log(motion);

    useEffect(() => {
        const token = localStorage.getItem("user_token");
        if (!token) {
            navigate("/login");
            return;
        }

        const loadOrderDetail = async () => {
            try {
                setLoading(true);
                let res;
                try {
                    res = await api.get(`/pesanan/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                } catch {
                    res = await api.get(`/api/pesanan/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                }
                setOrder(res.data?.data || res.data || null);
            } catch (err) {
                setError("Gagal memuat detail pesanan", err);
            } finally {
                setLoading(false);
            }
        };

        loadOrderDetail();
    }, [id, navigate]);

    useEffect(() => {
        const token = localStorage.getItem("user_token");
        if (!token) return;
        const loadUserAddress = async () => {
            try {
                const res = await api.get("/api/alamat", { headers: { Authorization: `Bearer ${token}` } });
                const list = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
                const defaultAddr = list.find(x => x.isDefault || x.is_default) || list[0];
                setUserAddr(defaultAddr || null);
            } catch (error) {
                console.warn("Gagal memuat alamat pengguna untuk detail pesanan:", error);
            }
        };
        loadUserAddress();
    }, []);

    const formatPrice = (val) => {
        if (typeof val !== "number") return "Rp 0";
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusStep = (status) => {
        const s = status?.toUpperCase();
        if (["PENDING", "UNPAID"].includes(s)) return 0;
        if (["PAID", "PROCESSING", "PACKED", "DIKEMAS", "DIPROSES"].includes(s)) return 1;
        if (["SHIPPED", "DIKIRIM"].includes(s)) return 2;
        if (["COMPLETED", "DELIVERED", "SELESAI"].includes(s)) return 3;
        return 0;
    };

    const steps = [
        { label: "Menunggu Pembayaran", icon: Clock, color: "amber" },
        { label: "Diproses", icon: Package, color: "blue" },
        { label: "Dikirim", icon: Truck, color: "purple" },
        { label: "Selesai", icon: CheckCircle, color: "green" },
    ];

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 dark:border-amber-500 border-t-transparent mx-auto" />
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat detail pesanan...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !order) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <Package className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                            Pesanan Tidak Ditemukan
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            {error || "Nomor pesanan tidak valid atau belum tersedia."}
                        </p>
                        <Link
                            to="/pesanan"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white font-medium transition"
                        >
                            <ChevronLeft className="w-5 h-5" /> Kembali ke Pesanan
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const currentStep = getStatusStep(order.status);

    // Alamat pengiriman
    const recipientName = order.customerName || userAddr?.namaLengkap || "Pelanggan";
    const baseAddress = order.shippingAddress || order.alamatLengkap || userAddr?.alamatLengkap || "-";
    const fullAddress = [
        baseAddress,
        userAddr?.kelurahan || order.kelurahan,
        userAddr?.kecamatan || order.kecamatan,
        userAddr?.kota || userAddr?.kabupaten || order.kota,
        userAddr?.provinsi || order.provinsi,
        userAddr?.kodePos || order.kodePos
    ].filter(Boolean).join(", ");
    const phone = order.customerPhone || userAddr?.nomorTelepon || "-";

    const items = Array.isArray(order.items) ? order.items : [];
    const totalItems = items.reduce((sum, it) => sum + (it.quantity || it.jumlah || 1), 0);
    const subtotal = items.reduce((sum, it) => sum + ((it.subtotal || (it.hargaSatuan || 0) * (it.quantity || it.jumlah || 1))), 0);
    const totalBayar = order.total || subtotal;

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-700 dark:to-amber-600 text-white py-10">
                    <div className="max-w-5xl mx-auto px-4">
                        <Link to="/pesanan" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4">
                            <ChevronLeft className="w-4 h-4" /> Kembali
                        </Link>
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    Pesanan #{order.id || order.orderId}
                                </h1>
                                <p className="mt-2 text-white/90">
                                    Dibuat pada {formatDate(order.createdAt)}
                                </p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${currentStep === 0 ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300" :
                                currentStep === 1 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" :
                                    currentStep === 2 ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300" :
                                        "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                                }`}>
                                {steps[currentStep].label}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 py-10">
                    {/* Status Timeline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-10 border border-gray-200 dark:border-gray-700"
                    >
                        <h2 className="text-lg font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
                            Status Pengiriman
                        </h2>
                        <div className="relative">
                            {steps.map((step, i) => {
                                const Icon = step.icon;
                                const isActive = i <= currentStep;
                                const isCompleted = i < currentStep;

                                return (
                                    <div key={i} className="flex items-center gap-4 mb-6 last:mb-0">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isActive
                                            ? step.color === "amber" ? "bg-amber-500 text-white"
                                                : step.color === "blue" ? "bg-blue-500 text-white"
                                                    : step.color === "purple" ? "bg-purple-500 text-white"
                                                        : "bg-green-500 text-white"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                            }`}>
                                            {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-medium ${isActive ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-500"}`}>
                                                {step.label}
                                            </p>
                                            {i === currentStep && order.updatedAt && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Terakhir update: {new Date(order.updatedAt).toLocaleString("id-ID")}
                                                </p>
                                            )}
                                        </div>
                                        {i < steps.length - 1 && (
                                            <div className={`w-0.5 h-12 mx-auto -mt-2 -mb-4 ${isActive ? "bg-amber-400 dark:bg-amber-600" : "bg-gray-300 dark:bg-gray-600"}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Produk */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <Package className="w-5 h-5 text-amber-600 dark:text-amber-400" /> Produk Dibeli
                                </h2>
                                <div className="space-y-4">
                                    {items.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                                        >
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-600">
                                                {item.gambarProduk ? (
                                                    <img src={item.gambarProduk} alt={item.namaProduk} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-3xl text-amber-400">✦</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {item.namaProduk || "Produk Emas"}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                                    {item.karatEmas || "24"}K • {item.beratGram || item.berat || "5"}g
                                                </p>
                                                <div className="flex justify-between items-end mt-3">
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {item.quantity || item.jumlah || 1} × {formatPrice(item.hargaSatuan)}
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold text-amber-600 dark:text-amber-400">
                                                        {formatPrice(item.subtotal || (item.hargaSatuan || 0) * (item.quantity || item.jumlah || 1))}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Ringkasan Pembayaran */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-400" /> Ringkasan
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Jumlah Item</span>
                                        <span className="font-medium">{totalItems} pcs</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                        <span className="font-medium">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Ongkir</span>
                                        <span className="text-green-600 dark:text-green-400 font-medium">Gratis</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 flex justify-between text-base font-bold text-amber-600 dark:text-amber-400">
                                        <span>Total Bayar</span>
                                        <span>{formatPrice(totalBayar)}</span>
                                    </div>
                                </div>

                                {currentStep === 0 && order.externalId && (
                                    <Link
                                        to={`/payment/${order.externalId}`}
                                        className="block mt-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white font-medium text-center transition"
                                    >
                                        Bayar Sekarang
                                    </Link>
                                )}

                                <Link
                                    to="/chat"
                                    state={{
                                        defaultMessage: `Halo Admin, saya ingin bertanya mengenai pesanan:
No. Pesanan: #${order.id || order.orderId}
Produk: ${items.map(i => i.namaProduk).join(", ")}
Total: ${formatPrice(totalBayar)}`
                                    }}
                                    className="block mt-3 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-center transition flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-4 h-4" /> Hubungi Penjual
                                </Link>
                            </div>

                            {/* Alamat Pengiriman */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" /> Pengiriman
                                </h3>
                                <div className="text-sm space-y-2">
                                    <p className="font-medium">{recipientName}</p>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{fullAddress}</p>
                                    <p className="text-gray-600 dark:text-gray-400">📞 {phone}</p>

                                    {order.resi && (
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">No. Resi</p>
                                            <p className="font-mono font-medium text-amber-600 dark:text-amber-400">{order.resi}</p>
                                            <button className="w-full mt-3 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white text-sm font-medium transition flex items-center justify-center gap-2">
                                                <Navigation className="w-4 h-4" /> Lacak Pengiriman
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}