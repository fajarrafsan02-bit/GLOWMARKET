import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import api from "../api/Axios.jsx";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function KeranjangPage({ setShowAuth }) {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const isLoggedIn = !!localStorage.getItem("user_token");

    useEffect(() => {
        if (!isLoggedIn) return;
        loadCart();
    }, [isLoggedIn]);

    const loadCart = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("user_token");
            const res = await api.get("/api/keranjang", { headers: { Authorization: `Bearer ${token}` } });
            const arr = Array.isArray(res.data?.data) ? res.data.data : [];
            setItems(arr);
        } catch (err) {
            const msg = err.message || err.response?.data?.message || err.response?.data?.error || "Gagal memuat keranjang";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const token = localStorage.getItem("user_token");
            await api.patch(`/api/keranjang/${id}`, { quantity: newQuantity }, { headers: { Authorization: `Bearer ${token}` } });
            await loadCart();
            window.dispatchEvent(new Event("cart:update"));
        } catch (err) {
            setNotice("Gagal mengubah jumlah");
            setTimeout(() => setNotice(""), 3000);
        }
    };

    const removeItem = async (id) => {
        try {
            const token = localStorage.getItem("user_token");
            await api.delete(`/api/keranjang/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setNotice("Item dihapus dari keranjang");
            setTimeout(() => setNotice(""), 2000);
            await loadCart();
            window.dispatchEvent(new Event("cart:update"));
        } catch (err) {
            setNotice("Gagal menghapus item");
            setTimeout(() => setNotice(""), 3000);
        }
    };

    const formatPrice = (val) => {
        if (typeof val !== "number") return val;
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
    };

    const totalPrice = items.reduce((sum, item) => {
        const harga = item.produk?.harga || item.harga || 0;
        const jumlah = item.jumlah || item.quantity || 0;
        return sum + harga * jumlah;
    }, 0);

    if (!isLoggedIn) {
        return (
            <>
                <Header setShowAuth={setShowAuth} />
                <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white dark:from-black dark:to-black flex items-center justify-center py-20 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-md"
                    >
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
                            Keranjang Belanja
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Silakan login terlebih dahulu untuk melihat keranjang Anda.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAuth?.(true)}
                            className="px-10 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-500 dark:to-yellow-500 text-white font-bold shadow-xl hover:shadow-2xl transition-all"
                        >
                            Login / Daftar
                        </motion.button>
                    </motion.div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header setShowAuth={setShowAuth} />

            {/* Background FULL DARK di dark mode - TIDAK ADA PUTIH LAGI */}
            <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-amber-50 dark:from-black dark:to-black py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-10"
                    >
                        Keranjang Belanja
                    </motion.h1>

                    <AnimatePresence>
                        {notice && (
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="mb-6 p-4 rounded-xl bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 text-center font-medium"
                            >
                                {notice}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-8 p-5 rounded-xl bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 text-center font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-600 dark:border-yellow-500 border-t-transparent"></div>
                            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">Memuat keranjang...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-20"
                        >
                            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-3xl font-bold text-gray-700 dark:text-gray-200 mb-4">
                                Keranjang Anda Kosong
                            </h3>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                Yuk tambahkan perhiasan emas impian Anda!
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/katalog"
                                    className="px-10 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-500 dark:to-yellow-500 text-white font-bold shadow-xl hover:shadow-2xl transition-all"
                                >
                                    Belanja Sekarang
                                </Link>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Daftar Item Keranjang */}
                            <div className="lg:col-span-2 space-y-5">
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -6 }}
                                        className="bg-white dark:bg-gray-900/98 rounded-2xl shadow-xl p-5 flex gap-5 border border-amber-100 dark:border-yellow-800/30 hover:shadow-2xl transition-all duration-500"
                                    >
                                        <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900">
                                            {item.produk?.gambar ? (
                                                <img
                                                    src={item.produk.gambar}
                                                    alt={item.produk.nama}
                                                    className="w-full h-full object-cover brightness-95"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-5xl text-amber-200 dark:text-yellow-500/30">
                                                    ✨
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                                                {item.produk?.nama || item.nama}
                                            </h3>
                                            {(item.produk?.berat || item.berat) && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {(item.produk?.berat || item.berat)} gram • Emas 24K
                                                </p>
                                            )}

                                            <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-yellow-400 dark:to-amber-400 mt-4">
                                                {formatPrice(item.produk?.harga || item.harga)}
                                            </p>

                                            <div className="flex items-center gap-5 mt-6">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>

                                                {/* Quantity Control - JELAS di light & dark */}
                                                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, (item.jumlah || item.quantity || 1) - 1)}
                                                        disabled={(item.jumlah || item.quantity || 1) <= 1}
                                                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition rounded-l-xl"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-6 py-2 text-center font-bold text-gray-900 dark:text-gray-100 min-w-12">
                                                        {item.jumlah ?? item.quantity ?? 1}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, (item.jumlah || item.quantity || 1) + 1)}
                                                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition rounded-r-xl"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Ringkasan Belanja - Sticky */}
                            <div className="lg:sticky lg:top-24 lg:self-start">
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white dark:bg-gray-900/98 rounded-2xl shadow-2xl p-6 border border-amber-100 dark:border-yellow-800/40"
                                >
                                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
                                        Ringkasan Belanja
                                    </h2>

                                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                        <div className="flex justify-between">
                                            <span>Total Harga ({items.length} item)</span>
                                            <span className="font-bold">{formatPrice(totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Ongkir</span>
                                            <span className="text-green-600 dark:text-green-400 font-bold">Gratis</span>
                                        </div>
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-xl">
                                            <span className="font-bold text-gray-900 dark:text-gray-100">Total Pembayaran</span>
                                            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-yellow-400 dark:to-amber-400">
                                                {formatPrice(totalPrice)}
                                            </span>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate("/checkout")}
                                        className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-500 dark:to-yellow-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                                    >
                                        Lanjut ke Checkout
                                    </motion.button>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </>
    );
}