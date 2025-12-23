import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import api from "../api/Axios.jsx";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Sparkles,
  Star,
  Heart,
  ShoppingCart,
  TrendingUp,
  Award,
  ChevronDown,
  Package,
  Zap,
  Users,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  Info,
  X,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserHome() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [notice, setNotice] = useState("");
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productReviews, setProductReviews] = useState({});

  // Limit to 5 products for home page
  const displayedItems = items.slice(0, 5);

  const fetchProductReviews = useCallback(async (produkId) => {
    try {
      const res = await api.get(`/api/reviews/produk/${produkId}`);
      const reviews = res.data?.data || [];
      setProductReviews((prev) => ({ ...prev, [produkId]: reviews }));
    } catch (error) {
      console.debug("Gagal memuat ulasan:", error);
    }
  }, []);

  const getReviewCount = (produkId) => {
    return (productReviews[produkId] || []).length;
  };

  const getAverageRating = (produkId) => {
    const reviews = productReviews[produkId] || [];
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

  useEffect(() => {
    if (items.length > 0) {
      items.forEach((p) => fetchProductReviews(p.id));
    }
  }, [items, fetchProductReviews]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/api/produk");
        const arr = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
            ? res.data
            : [];
        setItems(arr);
      } catch (err) {
        console.error('[UserHome] Error loading products:', err);
        setError("Gagal memuat produk. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey && (e.key === "4" || e.code === "Digit4")) {
        e.preventDefault();
        const token = localStorage.getItem("user_token");
        if (!token) {
          navigate("/admin/login", { replace: true });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const formatPrice = (val) => {
    if (typeof val !== "number") return val;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    setIsLoggedIn(!!token);
    
    const loadWishlist = async () => {
      if (!token) return;
      try {
        const wRes = await api.get("/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const wArr = Array.isArray(wRes.data?.data) ? wRes.data.data : [];
        setWishlistIds(wArr.map((w) => w.produkId).filter(Boolean));
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    };
    loadWishlist();
  }, []);

  const toggleWishlist = async (produkId, e = null) => {
    if (e) e.stopPropagation();
    const token = localStorage.getItem("user_token");
    if (!token) {
      setNotice("Login untuk menggunakan wishlist");
      setShowAuth(true);
      return;
    }
    try {
      const isInWishlist = wishlistIds.includes(produkId);
      if (isInWishlist) {
        const wRes = await api.get("/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const wishlistItem = (wRes.data?.data || []).find((w) => w.produkId === produkId);
        if (wishlistItem) {
          await api.delete(`/api/wishlist/${wishlistItem.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWishlistIds((prev) => prev.filter((id) => id !== produkId));
          setNotice("Dihapus dari wishlist");
        }
      } else {
        await api.post("/api/wishlist", { produkId }, { headers: { Authorization: `Bearer ${token}` } });
        setWishlistIds((prev) => [...prev, produkId]);
        setNotice("Ditambahkan ke wishlist");
      }
      window.dispatchEvent(new Event("wishlist:update"));
      setTimeout(() => setNotice(""), 2000);
    } catch (err) {
      setNotice("Gagal memperbarui wishlist");
      setTimeout(() => setNotice(""), 3000);
    }
  };

  const addToCart = async (produkId) => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      setNotice("Login untuk menambahkan ke keranjang");
      setShowAuth(true);
      return;
    }
    try {
      try {
        await api.post("/keranjang", { produkId, quantity: 1 }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        await api.post("/api/keranjang", { produkId, quantity: 1 }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setNotice("Berhasil ditambahkan ke keranjang!");
      window.dispatchEvent(new Event("cart:update"));
    } catch {
      setNotice("Gagal menambahkan ke keranjang");
    }
    setTimeout(() => setNotice(""), 3000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-black overflow-x-hidden transition-all duration-700">
      <Header setShowAuth={setShowAuth} />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600 dark:from-amber-900 dark:via-amber-800 dark:to-yellow-900 overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Award className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-semibold">Premium Gold Collection</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                Fajar Gold<br />Jewelry
              </h1>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Koleksi perhiasan emas premium dengan desain eksklusif dan kualitas terjamin. Setiap produk dilengkapi sertifikat keaslian.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white text-amber-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl"
                >
                  Lihat Koleksi
                </button>
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/20 transition-all"
                >
                  Hubungi Kami
                </button>
              </div>

              <div className="flex flex-wrap gap-6 mt-12">
                {[
                  { icon: ShieldCheck, text: "Emas Asli 100%" },
                  { icon: CheckCircle, text: "Bersertifikat" },
                  { icon: Users, text: "10K+ Pelanggan" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/90">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { icon: Package, label: "1000+", desc: "Produk Premium" },
                      { icon: Users, label: "10K+", desc: "Pelanggan Puas" },
                      { icon: Award, label: "100%", desc: "Emas Asli" },
                      { icon: Truck, label: "Gratis", desc: "Ongkir*" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center p-4 bg-white/10 rounded-2xl">
                        <stat.icon className="w-8 h-8 text-white mx-auto mb-2" />
                        <p className="text-3xl font-black text-white">{stat.label}</p>
                        <p className="text-sm text-white/80">{stat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">
            Mengapa Memilih Kami?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Kami memberikan pelayanan terbaik dengan jaminan kualitas produk dan kepuasan pelanggan
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: "Emas Asli 100%",
              desc: "Semua produk dilengkapi sertifikat keaslian resmi dari LM atau Antam",
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: Truck,
              title: "Pengiriman Aman",
              desc: "Gratis ongkir min. 5 juta. Packing anti-gores dengan asuransi",
              color: "from-green-500 to-green-600",
            },
            {
              icon: CreditCard,
              title: "Pembayaran Mudah",
              desc: "Transfer bank, kartu kredit, dan COD untuk area tertentu",
              color: "from-purple-500 to-purple-600",
            },
            {
              icon: Sparkles,
              title: "Desain Eksklusif",
              desc: "Koleksi limited edition dengan desain modern dan elegan",
              color: "from-amber-500 to-amber-600",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative h-full p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="max-w-7xl mx-auto px-4 py-16">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 shadow-lg flex items-start gap-3"
          >
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Terjadi Kesalahan</p>
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-amber-600 dark:text-amber-400 font-semibold text-sm">Koleksi Terbaru</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Koleksi Terbaru Kami
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Temukan perhiasan emas pilihan dengan desain eksklusif dan kualitas terbaik
          </p>
        </motion.div>

        {/* Product Grid - Show only 5 products */}
        {!loading && displayedItems.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {displayedItems.map((p) => (
                <div
                  key={p.id}
                  className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 cursor-pointer"
                  onClick={() => setSelectedProduct(p)}
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <button
                      onClick={(e) => toggleWishlist(p.id, e)}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 shadow-lg transition-all"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          wishlistIds.includes(p.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      />
                    </button>

                    {p.gambar && (p.gambar.startsWith("http") || p.gambar.startsWith("data:")) ? (
                      <img
                        src={p.gambar}
                        alt={p.nama}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-6xl opacity-20">💍</span>
                      </div>
                    )}

                    {p.karatEmas && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-full shadow-lg">
                        {p.karatEmas}K
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors min-h-[2.5rem]">
                      {p.nama}
                    </h3>

                    {/* Berat Gram */}
                    {p.beratGram && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        ⚖️ {p.beratGram}g
                      </p>
                    )}

                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => {
                          const avgRating = parseFloat(getAverageRating(p.id));
                          const filled = i < Math.floor(avgRating);
                          const partial = i === Math.floor(avgRating) && avgRating % 1 >= 0.5;
                          return (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${filled ? 'fill-amber-400 text-amber-400' : partial ? 'fill-amber-200 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        ({getAverageRating(p.id)}) • {getReviewCount(p.id)} ulasan
                      </span>
                    </div>

                    <p className="text-lg md:text-xl font-black text-amber-600 dark:text-amber-400 mb-3">
                      {formatPrice(p.harga)}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p.id);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Tambah
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Button to Catalog */}
            <div className="mt-12 text-center">
              <button
                onClick={() => navigate("/katalog")}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <Sparkles className="w-6 h-6" />
                Lihat Semua Produk di Katalog
                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Lihat {items.length} produk lengkap dengan fitur filter dan pencarian
              </p>
            </div>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-32 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Memuat koleksi terbaik...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="py-32 text-center">
            <div className="text-8xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Belum Ada Produk
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Produk akan segera tersedia
            </p>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div id="contact" className="bg-gray-100 dark:bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">
              Hubungi Kami
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Butuh bantuan atau ingin konsultasi? Tim kami siap membantu Anda
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Phone,
                title: "Telepon",
                value: "+62 812-3456-7890",
                desc: "Senin - Sabtu, 09:00 - 18:00",
              },
              {
                icon: Mail,
                title: "Email",
                value: "info@fajargold.com",
                desc: "Kami akan membalas dalam 24 jam",
              },
              {
                icon: MapPin,
                title: "Alamat Toko",
                value: "Jl. Sudirman No. 123, Jakarta",
                desc: "Buka setiap hari 10:00 - 20:00",
              },
            ].map((contact, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 text-center"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <contact.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{contact.title}</h3>
                <p className="text-amber-600 dark:text-amber-400 font-semibold mb-1">{contact.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{contact.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Detail */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800"
            >
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detail Produk</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
                {/* Image */}
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 aspect-square">
                    {selectedProduct.gambar &&
                    (selectedProduct.gambar.startsWith("http") ||
                      selectedProduct.gambar.startsWith("data:")) ? (
                      <img
                        src={selectedProduct.gambar}
                        alt={selectedProduct.nama}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-9xl">💍</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">Bersertifikat</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">Gratis Ongkir*</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <Package className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">Packing Aman</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4">
                      {selectedProduct.nama}
                    </h2>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedProduct.karatEmas && (
                        <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-full text-sm shadow-lg">
                          {selectedProduct.karatEmas}K Emas
                        </span>
                      )}
                      {selectedProduct.beratGram && (
                        <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-full text-sm">
                          ⚖️ {selectedProduct.beratGram}g
                        </span>
                      )}
                      <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold rounded-full text-sm">
                        ✓ Stok Tersedia
                        </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => {
                          const avgRating = parseFloat(getAverageRating(selectedProduct.id));
                          const filled = i < Math.floor(avgRating);
                          const partial = i === Math.floor(avgRating) && avgRating % 1 >= 0.5;
                          return (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${filled ? 'fill-amber-400 text-amber-400' : partial ? 'fill-amber-200 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {getAverageRating(selectedProduct.id)} <span className="text-gray-500">• {getReviewCount(selectedProduct.id)} ulasan</span>
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-6 p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Harga Spesial</p>
                      <p className="text-3xl md:text-4xl font-black text-amber-600 dark:text-amber-400">
                        {formatPrice(selectedProduct.harga)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        *Harga dapat berubah sesuai harga emas
                      </p>
                    </div>

                    {/* Description */}
                    {selectedProduct.deskripsi && (
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Info className="w-5 h-5 text-amber-600" />
                          Deskripsi Produk
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {selectedProduct.deskripsi}
                        </p>
                      </div>
                    )}

                    {/* Info Box */}
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                            Garansi Keaslian
                          </p>
                          <p className="text-blue-700 dark:text-blue-300">
                            Produk dilengkapi dengan sertifikat keaslian emas resmi dari LM atau Antam
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Ulasan Section */}
                    {productReviews[selectedProduct.id] && productReviews[selectedProduct.id].length > 0 ? (
                      <div className="mb-6 border-t border-gray-200 dark:border-gray-800 pt-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-amber-600" />
                          Ulasan Pembeli ({getReviewCount(selectedProduct.id)})
                        </h3>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {productReviews[selectedProduct.id].slice(0, 3).map((review) => (
                            <div key={review.id} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-xs">
                                    {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{review.userName || 'User'}</p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.komentar}</p>
                            </div>
                          ))}
                        </div>
                        {getReviewCount(selectedProduct.id) > 3 && (
                          <button 
                            onClick={() => navigate('/katalog')}
                            className="mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium w-full text-center"
                          >
                            Lihat semua ulasan di Katalog →
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="mb-6 border-t border-gray-200 dark:border-gray-800 pt-6 text-center">
                        <p className="text-gray-500 text-sm">Belum ada ulasan untuk produk ini</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <button
                      onClick={() => addToCart(selectedProduct.id)}
                      className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Tambah ke Keranjang
                    </button>
                    <button
                      onClick={(e) => toggleWishlist(selectedProduct.id, e)}
                      className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-lg"
                    >
                      <Heart
                        className={`w-6 h-6 transition-all ${
                          wishlistIds.includes(selectedProduct.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold shadow-2xl border border-gray-800 dark:border-gray-200 max-w-md"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 dark:text-green-600 flex-shrink-0" />
              <span>{notice}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}