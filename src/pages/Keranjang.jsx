import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import api from "../api/Axios.jsx";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function Keranjang() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("user_token");
        if (!token) {
            navigate("/login");
            return;
        }
        loadCart();
    }, [navigate]);

    const loadCart = async () => {
        try {
            setLoading(true);

            setError("");
            const token = localStorage.getItem("user_token");
            let res;
            try {
                res = await api.get("/keranjang", { headers: { Authorization: `Bearer ${token}` } });
            } catch {
                res = await api.get("/api/keranjang", { headers: { Authorization: `Bearer ${token}` } });
            }
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
            const msg = err.message || err.response?.data?.message || err.response?.data?.error || "Gagal mengubah jumlah";
            setNotice(msg);
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
            const msg = err.message || err.response?.data?.message || err.response?.data?.error || "Gagal menghapus item";
            setNotice(msg);
            setTimeout(() => setNotice(""), 3000);
        }
    };

    const formatPrice = (val) => {
        if (typeof val !== "number") return val;
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
    };

    const total = items.reduce((sum, item) => {
        const harga = item.produk?.harga || 0;
        const jumlah = item.jumlah || 0;
        return sum + (harga * jumlah);
    }, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-6xl mx-auto px-4 py-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Keranjang Belanja</h2>

                {notice && (
                    <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
                        {notice}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="py-10 text-center text-gray-600">Memuat keranjang...</div>
                )}

                {!loading && items.length === 0 && (
                    <div className="py-16 text-center">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg mb-4">Keranjang Anda kosong</p>
                        <button
                            onClick={() => navigate("/katalog")}
                            className="px-6 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-semibold"
                        >
                            Mulai Belanja
                        </button>
                    </div>
                )}

                {!loading && items.length > 0 && (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                    <div className="flex gap-4">
                                        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                            {item.produk?.gambar && (String(item.produk.gambar).startsWith("http") || String(item.produk.gambar).startsWith("data:")) ? (
                                                <img
                                                    src={item.produk.gambar}
                                                    alt={item.produk.nama}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-lg">{item.produk?.nama}</h3>
                                            <p className="text-yellow-700 font-semibold mt-1">{formatPrice(item.produk?.harga)}</p>

                                            <div className="flex items-center gap-3 mt-3">
                                                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.jumlah - 1)}
                                                        className="p-2 hover:bg-gray-100 rounded-l-lg"
                                                        disabled={item.jumlah <= 1}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-4 font-semibold">{item.jumlah}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.jumlah + 1)}
                                                        className="p-2 hover:bg-gray-100 rounded-r-lg"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 text-lg">
                                                {formatPrice((item.produk?.harga || 0) * item.jumlah)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Belanja</h3>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal ({items.length} item)</span>
                                        <span className="font-semibold">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mb-6">
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span className="text-yellow-700">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="w-full py-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-lg"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
