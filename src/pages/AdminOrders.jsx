import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import api from "../api/Axios.jsx";
import { Search, RefreshCw, Eye, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Package, Clock, DollarSign, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrders() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tempStatus, setTempStatus] = useState("");
  const [tempResi, setTempResi] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("newest");

  const statuses = ["PENDING", "DIKEMAS", "DIKIRIM", "SELESAI", "DIBATALKAN"];

  const statusLabel = (s) => {
    switch (s) {
      case "PENDING": return "Menunggu Bayar";
      case "DIKEMAS": return "Dikemas";
      case "DIKIRIM": return "Dikirim";
      case "SELESAI": return "Selesai";
      case "DIBATALKAN": return "Dibatalkan";
      default: return s || "Menunggu Bayar";
    }
  };

  const statusColor = (s) => {
    switch (s) {
      case "PENDING": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "DIKEMAS": return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
      case "DIKIRIM": return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
      case "SELESAI": return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
      case "DIBATALKAN": return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("admin_token");
    const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/pesanan", headers);
      const arr = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
      setItems(arr);
    } catch (err) {
      setError("Gagal memuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (val) => {
    if (typeof val !== "number") return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (d) => {
    if (!d) return "-";
    const date = new Date(d);
    return `${date.getDate()} ${date.toLocaleString("id-ID", { month: "short" })} ${date.getFullYear()}`;
  };

  const filtered = items
    .filter((o) => {
      const q = query.toLowerCase();
      return (
        (o.nomorPesanan || o.id || "").toString().toLowerCase().includes(q) ||
        (o.userName || o.customerName || o.email || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const openDetail = (order) => {
    setSelectedOrder(order);
    setTempStatus(order.status || "PENDING");
    setTempResi(order.nomorResi || "");
  };

  const saveChanges = async () => {
    if (!selectedOrder) return;
    const token = localStorage.getItem("admin_token");
    const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    try {
      await api.put(`/api/pesanan/${selectedOrder.id}/status`, {
        status: tempStatus,
      }, headers);

      setItems(prev =>
        prev.map(o => o.id === selectedOrder.id ? { ...o, status: tempStatus } : o)
      );
      setSelectedOrder(null);
    } catch {
      setError("Gagal simpan perubahan");
      setTimeout(() => setError(""), 4000);
    }
  };

  return (
    <AdminLayout title="Pesanan" activeMenu="orders">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-7">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Daftar Pesanan
            </h1>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
              Kelola pesanan pelanggan Fajar Gold
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-5">
            <div className="grid grid-cols-1 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari nomor atau nama..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>

              {/* Sort, Per Page, Refresh */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">Urutkan:</span>
                    <button
                      onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
                      className={`px-3 py-2.5 rounded-lg border flex items-center justify-center gap-1.5 transition text-sm ${
                        sortOrder === "newest"
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40"
                          : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40"
                      }`}
                    >
                      {sortOrder === "newest" ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                      <span className="font-medium">{sortOrder === "newest" ? "Terbaru" : "Terlama"}</span>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">Tampil:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                </div>

                <button
                  onClick={fetchOrders}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-70 text-white text-sm font-medium flex items-center justify-center gap-1.5 transition ml-auto"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Orders List */}
          <div className="space-y-3">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    </div>
                    <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-28" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-base">Tidak ada pesanan ditemukan</p>
              </div>
            ) : (
              currentItems.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition overflow-hidden"
                >
                  <div className="p-5 flex flex-col md:flex-row gap-6">
                    {/* Left Info */}
                    <div className="flex-1 space-y-4">
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              {order.nomorPesanan || `ORD-${order.id}`}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                          order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          order.status === 'DIKEMAS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          order.status === 'DIKIRIM' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          order.status === 'SELESAI' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {statusLabel(order.status)}
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                          <User className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Pelanggan</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                              {order.userName || order.customerName || order.email || "Guest"}
                            </p>
                            <p className="text-xs text-gray-500">{order.email}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                          <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Total Bayar</p>
                            <p className="text-sm font-bold text-amber-600 dark:text-amber-400 text-lg">
                              {formatPrice(order.totalHarga || order.total || 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col justify-center border-l border-gray-100 dark:border-gray-700 pl-0 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0">
                      <button
                        onClick={() => openDetail(order)}
                        className="w-full md:w-32 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition transform active:scale-95"
                      >
                        <Eye className="w-4 h-4" />
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && filtered.length > 0 && totalPages > 1 && (
            <div className="mt-7 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  {startIndex + 1} - {Math.min(endIndex, filtered.length)} dari {filtered.length}
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                      if (pageNum < 1 || pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition ${
                            currentPage === pageNum
                              ? "bg-amber-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="px-1 text-gray-500">...</span>
                        <button onClick={() => goToPage(totalPages)} className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm">
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Update Status
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedOrder.nomorPesanan || `ORD-${selectedOrder.id}`}
                </p>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Status Pesanan
                  </label>
                  <select
                    value={tempStatus}
                    onChange={(e) => setTempStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={saveChanges}
                    className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium text-sm transition"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}