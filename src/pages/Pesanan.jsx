/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import api from "../api/Axios.jsx";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  Shield,
  ChevronRight,
  MessageCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Star,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Pesanan() {
  const [showAuth, setShowAuth] = useState(false);
  const [externalId, setExternalId] = useState("");
  const [loadingSync, setLoadingSync] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" | "oldest"
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const loadOrders = async () => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }
    try {
      setOrdersLoading(true);
      setOrdersError("");
      let res;
      try {
        res = await api.get("/pesanan", { headers: { Authorization: `Bearer ${token}` } });
      } catch {
        res = await api.get("/api/pesanan", { headers: { Authorization: `Bearer ${token}` } });
      }
      const arr = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
      setOrders(arr);
    } catch (err) {
      setOrdersError("Gagal memuat pesanan",err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const sync = async () => {
    if (!externalId.trim()) return;
    try {
      setLoadingSync(true);
      setNotice("");
      let res = await api.get(`/payment/sync/${externalId.trim()}`);
      setNotice("Sinkronisasi berhasil!");
      setNoticeType("success");
      loadOrders();
    } catch (err) {
      setNotice("Gagal sinkronisasi pembayaran");
      setNoticeType("error");
    } finally {
      setLoadingSync(false);
      setTimeout(() => setNotice(""), 4000);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const formatPrice = (val) => {
    let n = typeof val === "number" ? val : parseInt(String(val).replace(/[^\d]/g, ""), 10) || 0;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);
  };

  const getOrderTotal = (o) => {
    if (typeof o?.total === "number") return o.total;
    if (Array.isArray(o?.items)) {
      return o.items.reduce((sum, it) => {
        const qty = parseInt(it.quantity ?? it.jumlah ?? 1, 10) || 1;
        const price = typeof it.hargaSatuan === "number" ? it.hargaSatuan : 0;
        return sum + price * qty;
      }, 0);
    }
    return 0;
  };

  const getStatusConfig = (status) => {
    const s = (status || "").toUpperCase();
    if (["PENDING", "UNPAID", "DIBUAT", "CREATED"].includes(s))
      return { label: "Menunggu Pembayaran", color: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400", icon: Clock };
    if (["PAID", "SETTLED", "PROCESSING", "DIKEMAS", "DIPROSES", "PACKED"].includes(s))
      return { label: "Diproses", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400", icon: Package };
    if (["SHIPPED", "DIKIRIM"].includes(s))
      return { label: "Dikirim", color: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400", icon: Truck };
    if (["COMPLETED", "DELIVERED", "SELESAI"].includes(s))
      return { label: "Selesai", color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400", icon: CheckCircle };
    return { label: status || "Unknown", color: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400", icon: Clock };
  };

  const filteredOrders = orders
    .filter((o) => {
      const s = (o.status || "").toUpperCase();
      if (activeTab === "all") return true;
      if (activeTab === "pending") return ["PENDING", "UNPAID", "DIBUAT", "CREATED"].includes(s);
      if (activeTab === "processing") return ["PAID", "SETTLED", "PROCESSING", "DIKEMAS", "DIPROSES", "PACKED"].includes(s);
      if (activeTab === "shipped") return ["SHIPPED", "DIKIRIM"].includes(s);
      if (activeTab === "completed") return ["COMPLETED", "DELIVERED", "SELESAI"].includes(s);
      return true;
    })
    .filter((o) =>
      (o.id || o.orderId || "").toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.externalId || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  
  const openReviewModal = (order, product) => {
    setSelectedOrder(order);
    setSelectedProduct(product);
    setReviewRating(0);
    setReviewComment("");
    setReviewError("");
    setShowReviewModal(true);
  };
  
  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedOrder(null);
    setSelectedProduct(null);
    setReviewRating(0);
    setReviewComment("");
    setReviewError("");
  };
  
  const submitReview = async () => {
    if (reviewRating === 0) {
      setReviewError("Pilih rating terlebih dahulu");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError("Tulis komentar Anda");
      return;
    }
  
    const token = localStorage.getItem("user_token");
    if (!token) {
      setReviewError("Silakan login terlebih dahulu");
      return;
    }
  
    try {
      setReviewLoading(true);
      setReviewError("");
  
      const payload = {
        produkId: selectedProduct.produkId,
        pesananId: selectedOrder.id || selectedOrder.orderId,
        rating: reviewRating,
        komentar: reviewComment.trim()
      };
  
      console.log('[Review] Submitting review:', payload);
  
      await api.post("/api/reviews", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setNotice("Review berhasil dikirim!");
      setNoticeType("success");
      closeReviewModal();
      loadOrders();
      setTimeout(() => setNotice(""), 4000);
    } catch (err) {
      console.error('[Review] Error:', err);
      setReviewError(err.response?.data?.message || "Gagal mengirim review. Silakan coba lagi.");
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <>
      <Header setShowAuth={setShowAuth} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section - Lebih Compact */}
        <div className="bg-linear-to-r from-amber-600 to-amber-500 dark:from-amber-700 dark:to-amber-600 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Pesanan Saya
            </h1>
            <p className="text-base opacity-90">
              Pantau status pesanan emas Anda dengan mudah
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Notice */}
          <AnimatePresence>
            {notice && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-xl text-white font-medium ${noticeType === "success" ? "bg-green-600" : "bg-red-600"
                  }`}
              >
                {notice}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sync Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 mb-8 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Sinkronisasi Status Pembayaran
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={externalId}
                onChange={(e) => setExternalId(e.target.value)}
                placeholder="Masukkan Invoice ID / External ID"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button
                onClick={sync}
                disabled={loadingSync || !externalId.trim()}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingSync ? "Memproses..." : "Sinkronkan"}
              </button>
            </div>
          </motion.div>

          {/* Tabs & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <div className="flex flex-wrap gap-3">
              {[
                { key: "all", label: "Semua" },
                { key: "pending", label: "Menunggu Bayar" },
                { key: "processing", label: "Diproses" },
                { key: "shipped", label: "Dikirim" },
                { key: "completed", label: "Selesai" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-2 rounded-lg font-medium transition-all ${activeTab === tab.key
                    ? "bg-amber-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-amber-500"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari pesanan..."
                  className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
                className={`px-4 py-3 rounded-xl border transition flex items-center gap-2 min-w-max ${
                  sortOrder === "newest"
                    ? "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                }`}
                title={sortOrder === "newest" ? "Terbaru ke Terlama" : "Terlama ke Terbaru"}
              >
                {sortOrder === "newest" ? <ArrowDown className="w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
                <span className="hidden md:inline text-sm font-medium">
                  {sortOrder === "newest" ? "Terbaru" : "Terlama"}
                </span>
              </button>
            </div>
          </div>

          {/* Loading */}
          {ordersLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 animate-pulse border border-gray-200 dark:border-gray-700">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-5" />
                  <div className="space-y-3">
                    <div className="h-16 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                    <div className="h-16 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!ordersLoading && filteredOrders.length === 0 && (
            <div className="text-center py-20">
              <Package className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Belum Ada Pesanan
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Mulai belanja emas impian Anda sekarang
              </p>
              <Link
                to="/katalog"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium transition"
              >
                Belanja Sekarang <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}

          {/* Orders List */}
          {!ordersLoading && filteredOrders.length > 0 && (
            <>
              {/* Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Pesanan</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {filteredOrders.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Nilai</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {formatPrice(filteredOrders.reduce((sum, o) => sum + getOrderTotal(o), 0))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredOrders.map((order) => {
                  const status = getStatusConfig(order.status);
                  const StatusIcon = status.icon;

                  return (
                    <motion.div
                      key={order.id || order.orderId}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -6 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full"
                    >
                      {/* Header */}
                      <div className="bg-linear-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 p-3 text-white">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-base">#{order.id || order.orderId}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-[10px] opacity-90 mt-0.5">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString("id-ID") : "-"}
                        </p>
                      </div>

                      {/* Items */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2 mb-3">
                          {(order.items || []).slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0">
                                {item.gambarProduk ? (
                                  <img src={item.gambarProduk} alt={item.namaProduk} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xl">✦</div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {item.namaProduk || "Produk Emas"}
                                </p>
                                <p className="text-[10px] text-gray-600 dark:text-gray-400">
                                  {item.quantity || item.jumlah || 1} × {formatPrice(item.hargaSatuan)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <p className="text-[10px] text-center text-gray-500 dark:text-gray-400">
                              +{order.items.length - 3} item lainnya
                            </p>
                          )}
                        </div>

                        {/* Total */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-end">
                          <div>
                            <p className="text-[10px] text-gray-600 dark:text-gray-400">Total</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {(order.items || []).reduce((s, it) => s + (it.quantity || it.jumlah || 1), 0)} item
                            </p>
                          </div>
                          <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                            {formatPrice(getOrderTotal(order))}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
                        <Link
                          to={`/pesanan/${order.id || order.orderId}`}
                          className="w-full text-center py-2 rounded-lg bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white font-medium text-xs transition flex items-center justify-center gap-1.5"
                        >
                          Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
                        </Link>

                        {(order.resi || order.nomorResi) && (
                          <div className="mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-center border border-gray-200 dark:border-gray-600">
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Nomor Resi</p>
                            <div className="flex items-center justify-center gap-1.5">
                              <Truck className="w-3 h-3 text-gray-400" />
                              <span className="font-mono font-bold text-xs text-gray-900 dark:text-white select-all">
                                {order.resi || order.nomorResi}
                              </span>
                            </div>
                          </div>
                        )}

                        <Link
                          to="/chat"
                          state={{
                            defaultMessage: `Halo Admin, saya ingin bertanya mengenai pesanan:
No. Pesanan: #${order.id || order.orderId}
Produk: ${(order.items || []).map(i => i.namaProduk).join(", ")}
Total: ${formatPrice(getOrderTotal(order))}`
                          }}
                          className="w-full text-center mt-2 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-xs transition flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Hubungi Penjual
                        </Link>

                        {/* Review Button - Only show for completed orders */}
                        {["COMPLETED", "DELIVERED", "SELESAI"].includes((order.status || "").toUpperCase()) && (
                          <div className="mt-2 space-y-1.5">
                            {(order.items || []).map((item, idx) => (
                              <button
                                key={idx}
                                onClick={() => openReviewModal(order, item)}
                                className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium text-xs transition flex items-center justify-center gap-1.5 shadow-sm hover:shadow"
                              >
                                <Star className="w-3.5 h-3.5 fill-current" /> 
                                Review {item.namaProduk}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeReviewModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-5 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Beri Review</h2>
                    <p className="text-xs opacity-90">{selectedProduct?.namaProduk}</p>
                  </div>
                  <button
                    onClick={closeReviewModal}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Product Info */}
                <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-600 overflow-hidden flex-shrink-0">
                    {selectedProduct?.gambarProduk ? (
                      <img src={selectedProduct.gambarProduk} alt={selectedProduct.namaProduk} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">✦</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{selectedProduct?.namaProduk}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Pesanan #{selectedOrder?.id || selectedOrder?.orderId}</p>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Rating Produk
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="transition-all duration-200 transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= reviewRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300 dark:text-gray-600"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  {reviewRating > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">
                      {reviewRating === 1 && "Sangat Buruk"}
                      {reviewRating === 2 && "Buruk"}
                      {reviewRating === 3 && "Cukup"}
                      {reviewRating === 4 && "Baik"}
                      {reviewRating === 5 && "Sangat Baik"}
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Komentar Anda
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                    Minimal 10 karakter ({reviewComment.length} karakter)
                  </p>
                </div>

                {/* Error */}
                {reviewError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm"
                  >
                    {reviewError}
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeReviewModal}
                    disabled={reviewLoading}
                    className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Batal
                  </button>
                  <button
                    onClick={submitReview}
                    disabled={reviewLoading || reviewRating === 0 || !reviewComment.trim()}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {reviewLoading ? "Mengirim..." : "Kirim Review"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}