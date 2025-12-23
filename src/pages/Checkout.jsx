import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import api from "../api/Axios.jsx";
import { ShoppingBag, CreditCard } from "lucide-react";

export default function Checkout({ setShowAuth }) {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [noticeType, setNoticeType] = useState("error");
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const isLoggedIn = !!localStorage.getItem("user_token");

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/keranjang");
            return;
        }
        loadCart();
        loadUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

    const loadUserData = async () => {
        try {
            const token = localStorage.getItem("user_token");

            const res = await api.get("/api/alamat", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const addressList = Array.isArray(res.data) ? res.data : [];
            setAddresses(addressList);

            const defaultAddr = addressList.find(a => a.isDefault);
            if (defaultAddr) {
                setSelectedAddress(defaultAddr.id);
            } else if (addressList.length > 0) {
                setSelectedAddress(addressList[0].id);
            }
        } catch (err) {
            console.log("Could not load addresses:", err.message);
        }
    };

    const loadCart = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("user_token");
            const res = await api.get("/api/keranjang", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const arr = Array.isArray(res.data?.data) ? res.data.data : [];
            if (arr.length === 0) {
                navigate("/keranjang");
            }
            setItems(arr);
        } catch (err) {
            setError("Gagal memuat keranjang", err);
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

    const totalPrice = items.reduce((sum, item) => {
        const harga = item.produk?.harga || item.harga || 0;
        const jumlah = item.jumlah || item.quantity || 0;
        return sum + harga * jumlah;
    }, 0);

    const selectedAddressObj = addresses.find(a => a.id === parseInt(selectedAddress));

    const handleCheckout = async () => {
        if (!selectedAddress) {
            const msg = "Pilih alamat pengiriman terlebih dahulu";
            setError(msg);
            setNotice(msg);
            setNoticeType("error");
            setTimeout(() => setNotice(""), 4000);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (!Array.isArray(items) || items.length === 0) {
            const msg = "Keranjang kosong";
            setError(msg);
            setNotice(msg);
            setNoticeType("error");
            setTimeout(() => setNotice(""), 4000);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setProcessing(true);
        setError("");

        try {
            const token = localStorage.getItem("user_token");
            const userEmail = localStorage.getItem("user_email") || "";
            const userName = localStorage.getItem("user_name") || "Customer";

            const selectedAddr = addresses.find(a => a.id === parseInt(selectedAddress));

            const computedAmount = items.reduce((sum, item) => {
                const harga = item.produk?.harga || item.harga || 0;
                const jumlah = item.jumlah || item.quantity || 0;
                return sum + (harga * jumlah);
            }, 0);

            const paymentData = {
                amount: Math.round(computedAmount),
                customerName: selectedAddr?.namaLengkap || userName,
                customerEmail: userEmail,
                customerPhone: selectedAddr?.nomorTelepon || "",
                description: `Pembelian ${items.length} produk emas`,
                alamatId: parseInt(selectedAddress),
                catatan: selectedAddr?.catatan || ""
            };

            const res = await api.post("/api/payments/create-invoice", paymentData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data?.success && res.data?.data) {
                const payment = res.data.data;

                navigate("/payment", {
                    state: {
                        invoiceUrl: payment.invoiceUrl,
                        externalId: payment.externalId,
                        amount: payment.amount,
                        status: payment.status
                    }
                });
            } else {
                throw new Error("Gagal membuat invoice");
            }
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                (Array.isArray(err.response?.data?.errors) ? err.response.data.errors.join(", ") : null) ||
                err.message ||
                "Gagal memproses pembayaran";
            setError(msg);
            setNotice(msg);
            setNoticeType("error");
            setTimeout(() => setNotice(""), 5000);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setProcessing(false);
        }
    };

    if (!isLoggedIn) return null;

    return (
        <>
            <Header setShowAuth={setShowAuth} />

            {/* Background utama yang support light & dark 100% */}
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <div className="container mx-auto px-4 py-12 max-w-6xl">
                    {notice && (
                        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl text-white font-semibold ${noticeType === "error" ? "bg-red-600" : "bg-green-600"}`}>
                            {notice}
                        </div>
                    )}

                    <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
                        <ShoppingBag className="inline-block w-9 h-9 mr-3 text-amber-600 dark:text-amber-500" />
                        Checkout
                    </h1>

                    {error && (
                        <div className="mb-8 p-5 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-20 text-lg">Memuat data...</div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Kiri: Alamat & Produk */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Alamat Pengiriman */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl md:text-2xl font-bold mb-6">Alamat Pengiriman</h2>

                                    {addresses.length === 0 ? (
                                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                            Belum ada alamat tersimpan. Atur alamat di halaman Profil.
                                        </div>
                                    ) : (
                                        <div className="p-6 rounded-xl bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-500 dark:border-amber-600">
                                            <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                                                {selectedAddressObj?.namaLengkap}
                                            </p>
                                            <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                                                {selectedAddressObj?.nomorTelepon}
                                            </p>
                                            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
                                                {selectedAddressObj?.alamatLengkap}
                                            </p>
                                            {selectedAddressObj?.isDefault && (
                                                <span className="inline-block mt-3 px-4 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full border border-green-300 dark:border-green-700">
                                                    Alamat Utama
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Produk yang Dibeli */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl md:text-2xl font-bold mb-6">Produk yang Dibeli</h2>
                                    <div className="space-y-5">
                                        {items.map(item => (
                                            <div key={item.id} className="flex gap-5 items-center border-b border-gray-200 dark:border-gray-700 pb-5 last:border-0 last:pb-0">
                                                <img
                                                    src={item.produk?.gambar || "/placeholder.jpg"}
                                                    alt={item.produk?.nama}
                                                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl shadow-md"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-base md:text-lg">
                                                        {item.produk?.nama || item.nama}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        Jumlah: {item.jumlah || item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-bold text-amber-600 dark:text-amber-500 text-base md:text-lg">
                                                    {formatPrice((item.produk?.harga || item.harga) * (item.jumlah || item.quantity))}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Ringkasan Pembayaran */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 h-fit sticky top-24 border border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl md:text-2xl font-bold mb-6">Ringkasan Pembayaran</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                        <span>Subtotal ({items.length} produk)</span>
                                        <span className="font-semibold">{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                        <span>Ongkir</span>
                                        <span className="text-green-600 dark:text-green-400 font-semibold">Gratis</span>
                                    </div>
                                    <div className="border-t border-gray-300 dark:border-gray-600 pt-5 flex justify-between text-lg md:text-xl font-bold text-amber-600 dark:text-amber-500">
                                        <span>Total Pembayaran</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={processing || addresses.length === 0}
                                    className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-3 shadow-lg disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Bayar Sekarang
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-5 text-center">
                                    Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
                                </p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
}