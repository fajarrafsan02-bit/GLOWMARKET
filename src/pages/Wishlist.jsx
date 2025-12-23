import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import api from "../api/Axios.jsx";
import { Heart, ShoppingCart, Trash2, Shield, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadWishlist();
  }, [navigate]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("user_token");
      let res;
      try {
        res = await api.get("/wishlist", { headers: { Authorization: `Bearer ${token}` } });
      } catch {
        res = await api.get("/api/wishlist", { headers: { Authorization: `Bearer ${token}` } });
      }
      const arr = Array.isArray(res.data?.data) ? res.data.data : [];
      setItems(arr);
    } catch (err) {
      setError("Gagal memuat wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      const token = localStorage.getItem("user_token");
      try {
        await api.delete(`/wishlist/${wishlistId}`, { headers: { Authorization: `Bearer ${token}` } });
      } catch {
        await api.delete(`/api/wishlist/${wishlistId}`, { headers: { Authorization: `Bearer ${token}` } });
      }
      setNotice("Item dihapus dari wishlist");
      setNoticeType("success");
      window.dispatchEvent(new Event("wishlist:update"));
      setTimeout(() => setNotice(""), 3000);
      loadWishlist();
    } catch {
      setNotice("Gagal menghapus item");
      setNoticeType("error");
      setTimeout(() => setNotice(""), 4000);
    }
  };

  const addToCart = async (produk) => {
    try {
      const token = localStorage.getItem("user_token");
      try {
        await api.post("/keranjang", { produkId: produk.id, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } });
      } catch {
        await api.post("/api/keranjang", { produkId: produk.id, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setNotice(`${produk.nama} ditambahkan ke keranjang`);
      setNoticeType("success");
      window.dispatchEvent(new Event("cart:update"));
      setTimeout(() => setNotice(""), 3000);
    } catch {
      setNotice("Gagal tambah ke keranjang");
      setNoticeType("error");
      setTimeout(() => setNotice(""), 4000);
    }
  };

  const addAllToCart = async () => {
    for (const item of items) {
      await addToCart(item.produk);
    }
    setNotice("Semua item dipindah ke keranjang!");
    setNoticeType("success");
    setTimeout(() => setNotice(""), 4000);
  };

  const formatPrice = (val) => {
    if (typeof val !== "number") return "Rp -";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <>
      <Header />

      {/* Hilangkan bg-gray-50 agar tidak ada celah putih */}
      <div className="min-h-screen bg-transparent dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-700 dark:to-amber-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Wishlist Favorit
            </h1>
            <p className="text-lg opacity-90">
              Simpan produk emas incaran Anda
            </p>
          </div>
        </div>

        {/* Konten utama - tambah pb agar footer tidak menutupi */}
        <div className="max-w-7xl mx-auto px-4 py-10 pb-20">
          {/* Notice */}
          <AnimatePresence>
            {notice && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-xl text-white font-medium ${
                  noticeType === "success" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {notice}
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mb-8 p-5 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 text-center">
              {error}
            </div>
          )}

          {loading && (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-600 dark:border-amber-500 border-t-transparent" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat wishlist...</p>
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="text-center py-20">
              <Heart className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6 stroke-2" />
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Wishlist Kosong
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Tambahkan produk favorit dari katalog
              </p>
              <button
                onClick={() => navigate("/katalog")}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white font-medium transition"
              >
                Jelajahi Katalog <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {!loading && items.length > 0 && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Produk Favorit ({items.length})
                </h2>
                <button
                  onClick={addAllToCart}
                  className="px-6 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white font-medium transition flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Pindah Semua ke Keranjang
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {items.map((item) => {
                  const p = item.produk;
                  if (!p) return null;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -6 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                        {p.gambar && (String(p.gambar).startsWith("http") || String(p.gambar).startsWith("data:")) ? (
                          <img
                            src={p.gambar}
                            alt={p.nama}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl text-amber-300 dark:text-amber-600">
                            ✦
                          </div>
                        )}

                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-2 right-2 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow hover:bg-white dark:hover:bg-gray-700 transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>

                        <div className="absolute bottom-2 left-2 px-3 py-1.5 bg-amber-600 dark:bg-amber-500 text-white text-xs font-bold rounded-full shadow">
                          {p.beratGram || "5"}g • {p.karatEmas || "24"}K
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
                          {p.nama}
                        </h3>

                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Sertifikat Resmi</span>
                        </div>

                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-4">
                          {formatPrice(p.harga)}
                        </p>

                        <button
                          onClick={() => addToCart(p)}
                          className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white text-sm font-medium transition flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Tambah ke Keranjang
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer akan menempel sempurna tanpa celah */}
      <Footer />
    </>
  );
}