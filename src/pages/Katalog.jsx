/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import api from "../api/Axios.jsx";
import { Search, X, Heart, ShoppingCart, Star, Eye, Shield, CheckCircle, Filter, ChevronDown, Clock, TrendingUp, Gem, Scale, Sparkles, User as UserIcon, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Katalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedKarat, setSelectedKarat] = useState("Semua");
  const [sortBy, setSortBy] = useState("terbaru");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [productReviews, setProductReviews] = useState({}); // Store reviews by produkId
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    setIsLoggedIn(!!token);

    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/produk");
        const arr = Array.isArray(res.data?.data) ? res.data.data : [];
        setItems(arr);

        // Fetch reviews for all products inline to avoid dependency issues
        arr.forEach(async (product) => {
          try {
            const reviewRes = await api.get(`/api/reviews/produk/${product.id}`);
            const reviews = reviewRes.data?.data || [];
            setProductReviews(prev => ({
              ...prev,
              [product.id]: reviews
            }));
          } catch (err) {
            console.error('[Katalog] Error fetching reviews:', err);
          }
        });

        if (token) {
          try {
            const wRes = await api.get("/api/wishlist", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const wArr = Array.isArray(wRes.data?.data) ? wRes.data.data : [];
            setWishlistIds(wArr.map((w) => w.produkId).filter(Boolean));
          } catch (error) {
            console.debug("Gagal memuat wishlist", error);
          }
        }
      } catch (error) {
        console.error("Gagal memuat katalog", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Fetch reviews for a specific product
  const fetchProductReviews = async (produkId) => {
    if (productReviews[produkId]) return; // Already loaded

    try {
      setLoadingReviews(true);
      const res = await api.get(`/api/reviews/produk/${produkId}`);
      const reviews = res.data?.data || [];

      setProductReviews(prev => ({
        ...prev,
        [produkId]: reviews
      }));
    } catch (err) {
      console.error('[Katalog] Error fetching reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Calculate average rating for a product
  const getAverageRating = (produkId) => {
    const reviews = productReviews[produkId] || [];
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Get review count
  const getReviewCount = (produkId) => {
    return (productReviews[produkId] || []).length;
  };

  const formatPrice = (val) =>
    typeof val === "number"
      ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(val)
      : val;

  const categories = ["Anting", "Cincin", "Kalung", "Gelang", "Liontin", "Setelan"];
  const karatOptions = [
    { value: "Semua", label: "Semua Karat" },
    { value: "24K", label: "24K" },
    { value: "22K", label: "22K" },
    { value: "18K", label: "18K" },
    { value: "14K", label: "14K" }
  ];

  const filteredSortedItems = useMemo(() => {
    let arr = [...items];
    const q = query.trim().toLowerCase();
    if (q) arr = arr.filter((p) => p.nama?.toLowerCase().includes(q));

    // Filter by category
    if (selectedCategory !== "Semua") {
      const key = selectedCategory.toLowerCase();
      arr = arr.filter((p) => p.nama?.toLowerCase().includes(key));
    }

    // Filter by karat
    if (selectedKarat !== "Semua") {
      const karatValue = parseInt(selectedKarat.replace('K', ''));
      arr = arr.filter((p) => p.karatEmas === karatValue);
    }

    // Sort
    if (sortBy === "harga_asc") arr.sort((a, b) => a.harga - b.harga);
    else if (sortBy === "harga_desc") arr.sort((a, b) => b.harga - a.harga);
    else if (sortBy === "karat_asc") arr.sort((a, b) => (a.karatEmas || 0) - (b.karatEmas || 0));
    else if (sortBy === "karat_desc") arr.sort((a, b) => (b.karatEmas || 0) - (a.karatEmas || 0));
    return arr;
  }, [items, query, selectedCategory, selectedKarat, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredSortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredSortedItems.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategory, selectedKarat, sortBy]);

  const addToCart = async (p) => {
    if (!isLoggedIn) {
      setNotice("Silakan login terlebih dahulu");
      setShowAuth(true);
      return;
    }
    try {
      await api.post("/api/keranjang", { produkId: p.id, quantity: 1 }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("user_token")}` },
      });
      setNotice("Ditambahkan ke keranjang!");
      window.dispatchEvent(new Event("cart:update"));
    } catch (err) {
      setNotice(err.response?.data?.message || "Gagal tambah ke keranjang");
    }
    setTimeout(() => setNotice(""), 3000);
  };

  const toggleWishlist = async (produkId) => {
    if (!isLoggedIn) {
      setNotice("Silakan login terlebih dahulu");
      setShowAuth(true);
      return;
    }
    const isIn = wishlistIds.includes(produkId);
    try {
      if (isIn) {
        const wRes = await api.get("/api/wishlist", {
          headers: { Authorization: `Bearer ${localStorage.getItem("user_token")}` },
        });
        const item = (wRes.data?.data || []).find((w) => w.produkId === produkId);
        if (item) await api.delete(`/api/wishlist/${item.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("user_token")}` } });
        setWishlistIds((prev) => prev.filter((id) => id !== produkId));
        setNotice("Dihapus dari wishlist");
      } else {
        await api.post("/api/wishlist", { produkId }, { headers: { Authorization: `Bearer ${localStorage.getItem("user_token")}` } });
        setWishlistIds((prev) => [...prev, produkId]);
        setNotice("Ditambahkan ke wishlist");
      }
      window.dispatchEvent(new Event("wishlist:update"));
    } catch {
      setNotice("Gagal update wishlist");
    }
    setTimeout(() => setNotice(""), 3000);
  };

  return (
    <>
      <Header setShowAuth={setShowAuth} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Katalog Emas Fajar Gold
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-400">
              {filteredSortedItems.length} produk emas murni bersertifikat tersedia
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari perhiasan emas (cincin, kalung, gelang...)"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-all"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gray-100 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium"
              >
                <Filter className="w-5 h-5" />
                Filter
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all lg:w-56"
              >
                <option value="terbaru">Terbaru</option>
                <option value="harga_asc">Harga: Terendah</option>
                <option value="harga_desc">Harga: Tertinggi</option>
                <option value="karat_asc">Karat: Terendah</option>
                <option value="karat_desc">Karat: Tertinggi</option>
              </select>
            </div>

            {/* Categories Desktop */}
            <div className="hidden lg:flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("Semua")}
                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${selectedCategory === "Semua"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${selectedCategory === cat
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Karat Filter Desktop */}
            <div className="hidden lg:block pt-6 mt-6 border-t-2 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Filter Karat:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {karatOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedKarat(option.value)}
                    className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${selectedKarat === option.value
                        ? "bg-linear-to-r from-yellow-500 to-yellow-600 text-white shadow-lg scale-105"
                        : "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Mobile */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden overflow-hidden"
                >
                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="w-full text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Kategori:
                    </span>
                    <button
                      onClick={() => setSelectedCategory("Semua")}
                      className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${selectedCategory === "Semua"
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                        }`}
                    >
                      Semua
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                        }}
                        className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${selectedCategory === cat
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                            : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Karat Filter */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                    <span className="w-full text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Filter Karat:
                    </span>
                    {karatOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedKarat(option.value);
                        }}
                        className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${selectedKarat === option.value
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
                            : "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Info */}
          {!loading && filteredSortedItems.length > 0 && (
            <div className="flex items-center justify-between mb-6 px-2">
              <p className="text-gray-600 dark:text-gray-400">
                Menampilkan <span className="font-bold text-gray-900 dark:text-white">{currentItems.length}</span> dari{" "}
                <span className="font-bold text-gray-900 dark:text-white">{filteredSortedItems.length}</span> produk
                {selectedCategory !== "Semua" && (
                  <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
                    • {selectedCategory}
                  </span>
                )}
                {selectedKarat !== "Semua" && (
                  <span className="ml-2 text-yellow-600 dark:text-yellow-400 font-medium">
                    • {selectedKarat}
                  </span>
                )}
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Halaman {currentPage} dari {totalPages}
                </p>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden animate-pulse border border-gray-200 dark:border-gray-700">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredSortedItems.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-7xl mb-6 text-amber-200">
                <Sparkles className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Produk Tidak Ditemukan
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                Coba gunakan kata kunci lain atau ubah filter pencarian
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("Semua");
                  setSelectedKarat("Semua");
                  setSortBy("terbaru");
                }}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-all shadow-lg inline-flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset Semua Filter
              </button>
            </div>
          )}

          {/* Product Grid */}
          {!loading && currentItems.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                <AnimatePresence>
                  {currentItems.map((p, i) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      whileHover={{ y: -8 }}
                      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
                        {/* Wishlist Button - Always Visible, Inside Image Container */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(p.id);
                          }}
                          className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 hover:shadow-xl transition-all duration-200"
                        >
                          {wishlistIds.includes(p.id) ? (
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                          ) : (
                            <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors" />
                          )}
                        </button>
                        {p.gambar ? (
                          <img
                            src={p.gambar}
                            alt={p.nama}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl text-amber-300 opacity-50">
                            <Sparkles className="w-16 h-16" />
                          </div>
                        )}

                        {/* Karat Badge */}
                        {p.karatEmas && (
                          <span className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold rounded-full shadow-lg">
                            {p.karatEmas}K
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4 sm:p-5">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 text-sm sm:text-base mb-2 text-center">
                          {p.nama}
                        </h3>

                        {/* Berat Gram */}
                        {p.beratGram && (
                          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-2">
                            {p.beratGram}g
                          </p>
                        )}

                        {/* Rating & Review Badge */}
                        <div className="flex flex-col items-center gap-1.5 mb-3">
                          <div className="flex justify-center gap-0.5">
                            {[...Array(5)].map((_, i) => {
                              const avgRating = parseFloat(getAverageRating(p.id)) || 0;
                              const filled = i < Math.floor(avgRating);
                              const partial = i === Math.floor(avgRating) && avgRating % 1 >= 0.5;

                              return (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${filled ? 'fill-amber-400 text-amber-400' :
                                      partial ? 'fill-amber-200 text-amber-400' :
                                        'text-gray-300 dark:text-gray-600'
                                    }`}
                                />
                              );
                            })}
                          </div>

                          {/* Review Count Badge */}
                          {getReviewCount(p.id) > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {getAverageRating(p.id)}
                              </span>
                              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {getReviewCount(p.id)}
                              </span>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 dark:text-gray-500">Belum ada ulasan</p>
                          )}
                        </div>

                        <p className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 text-center mb-1">
                          {formatPrice(p.harga)}
                        </p>
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-4">
                          Stok: {p.stock ?? 0} pcs
                        </p>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(p);
                            }}
                            className="py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-sm font-semibold transition shadow-md flex items-center justify-center gap-2 transform active:scale-95"
                            title="Beli"
                          >
                            <ShoppingCart className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(p);
                              fetchProductReviews(p.id);
                            }}
                            className="py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold transition flex items-center justify-center gap-2 transform active:scale-95"
                            title="Detail"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    ← Prev
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all shadow-sm ${currentPage === page
                                ? "bg-linear-to-r from-amber-500 to-amber-600 text-white scale-110"
                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 py-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL DETAIL PRODUK - RESPONSIF & RAPI DI MOBILE */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 overflow-y-auto"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col"
            >
              {/* Header Modal */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                  {selected.nama}
                </h3>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Body Modal - Compact Layout without Scroll */}
              <div className="p-5 flex flex-col gap-5 max-h-[calc(90vh-80px)] overflow-y-auto">
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Gambar */}
                  <div className="w-full sm:w-1/2 rounded-2xl overflow-hidden shadow-lg bg-gray-50 dark:bg-gray-700 aspect-square shrink-0">
                    {selected.gambar ? (
                      <img
                        src={selected.gambar}
                        alt={selected.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl text-amber-300 opacity-40">
                        <Sparkles className="w-16 h-16" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-between w-full sm:w-1/2 space-y-3">
                    <div>
                      {/* Karat Badge */}
                      {selected.karatEmas && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold rounded-full text-xs mb-2">
                          <Shield className="w-3.5 h-3.5" />
                          {selected.karatEmas}K Emas Murni
                        </span>
                      )}

                      {/* Berat */}
                      {selected.beratGram && (
                        <div className="flex items-center gap-2 mt-2 mb-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Berat:</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{selected.beratGram} gram</span>
                        </div>
                      )}

                      {/* Harga */}
                      <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                        {formatPrice(selected.harga)}
                      </p>
                    </div>

                    {/* Rating & Stok */}
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-gray-900 dark:text-gray-200">
                          {getAverageRating(selected.id) || '0.0'}
                        </span>
                        <span>({getReviewCount(selected.id)} ulasan)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Stok: <strong className="text-gray-900 dark:text-gray-200">{selected.stock}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                {productReviews[selected.id] && productReviews[selected.id].length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <h4 className="font-bold text-gray-900 dark:text-white">Ulasan Pembeli</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">({getReviewCount(selected.id)})</span>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {productReviews[selected.id].slice(0, 5).map((review) => (
                        <div key={review.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          {/* Review Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                                {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                  {review.userName || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(review.createdAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Rating Stars */}
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < review.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Review Comment */}
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {review.komentar}
                          </p>
                        </div>
                      ))}

                      {getReviewCount(selected.id) > 5 && (
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
                          Menampilkan 5 dari {getReviewCount(selected.id)} ulasan
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* No Reviews Yet */}
                {productReviews[selected.id] && productReviews[selected.id].length === 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                    <div className="text-center py-6">
                      <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada ulasan untuk produk ini</p>
                    </div>
                  </div>
                )}

                {/* Tombol Aksi */}
                <div className="grid grid-cols-1 gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => addToCart(selected)}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm transition shadow-lg shadow-amber-600/20 flex items-center justify-center gap-3 transform active:scale-[0.98]"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Tambah ke Keranjang</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(selected.id)}
                    className={`w-full py-3 rounded-xl border-2 font-semibold text-sm transition flex items-center justify-center gap-2 transform active:scale-[0.98] ${wishlistIds.includes(selected.id)
                        ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-900/20 dark:border-red-500/50"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
                      }`}
                  >
                    <Heart
                      className={`w-5 h-5 transition-transform ${wishlistIds.includes(selected.id) ? "fill-current scale-110" : ""
                        }`}
                    />
                    <span>{wishlistIds.includes(selected.id) ? "Disimpan di Wishlist" : "Simpan ke Wishlist"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notice Toast */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-2xl text-center"
          >
            {notice}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}