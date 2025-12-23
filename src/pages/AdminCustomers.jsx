import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import api from "../api/Axios.jsx";
import { Search, Mail, Phone, User, MoreVertical, Eye, Edit, Ban, X, MapPin, ShoppingBag, Calendar, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Komponen AdminCustomers
 * 
 * Halaman ini digunakan oleh admin untuk mengelola data pelanggan.
 * Fitur:
 * - Menampilkan daftar pelanggan
 * - Pencarian pelanggan
 * - Melihat detail pelanggan (placeholder)
 * - Mengedit profil pelanggan (placeholder)
 * - Menonaktifkan pelanggan (placeholder)
*/
export default function AdminCustomers() {
    console.log(motion);
    // State untuk menyimpan daftar pelanggan
    const [customers, setCustomers] = useState([]);
    // State untuk status loading saat mengambil data
    const [loading, setLoading] = useState(true);
    // State untuk kata kunci pencarian
    const [searchTerm, setSearchTerm] = useState("");
    // State untuk menyimpan pelanggan yang sedang dipilih (untuk dropdown menu)
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    // State untuk pesan error jika ada masalah saat mengambil data
    const [error, setError] = useState("");
    // State untuk notifikasi fitur mendatang
    const [showFeatureNotice, setShowFeatureNotice] = useState(false);
    // State untuk modal detail pelanggan
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailCustomer, setDetailCustomer] = useState(null);

    // Effect untuk mengambil data pelanggan saat komponen dimuat
    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        /**
         * Fungsi asinkron untuk mengambil data pelanggan dari API.
         * Mencoba beberapa endpoint alternatif jika endpoint utama gagal.
         */
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                setError("");
                let res;
                // Daftar kemungkinan endpoint API untuk data user
                const candidates = [
                    "/api/user/all",
                    "/api/admin/users",
                    "/api/users",
                    "/api/user/list",
                    "/admin/users"
                ];
                
                // Mencoba setiap endpoint satu per satu
                for (const p of candidates) {
                    try {
                        res = await api.get(p, headers);
                        // Jika berhasil mendapatkan data, hentikan loop
                        if (res?.data) break;
                    } catch (error) {
                        // Jika endpoint gagal, lanjut ke endpoint berikutnya dalam daftar kandidat
                        console.warn(`Gagal mengambil data dari ${p}, mencoba endpoint lain...`, error);
                    }
                }
                
                // Normalisasi data respons API (menangani format {data: []} atau [])
                const arr = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
                setCustomers(Array.isArray(arr) ? arr : []);
            } catch (err) {
                // Menangani error global jika semua percobaan gagal
                setError(err?.response?.data?.message || err?.message || "Gagal memuat data pelanggan");
                setCustomers([]);
            } finally {
                // Mematikan status loading baik sukses maupun gagal
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    // Memfilter pelanggan berdasarkan kata kunci pencarian (nama, email, atau no hp)
    const filtered = customers.filter((c) =>
        `${c.nama || c.name || ""} ${c.email || ""} ${c.phone || c.nomorTelepon || ""}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Handler untuk menampilkan detail pelanggan
    const handleViewDetail = (customer) => {
        setDetailCustomer(customer);
        setShowDetailModal(true);
        setSelectedCustomer(null);
    };

    // Handler untuk fitur yang belum tersedia
    const handleFeatureComingSoon = () => {
        setShowFeatureNotice(true);
        setSelectedCustomer(null);
        setTimeout(() => setShowFeatureNotice(false), 3000);
    };

    return (
        <AdminLayout title="Pelanggan" activeMenu="customers">
            <div className="p-4 md:p-6 lg:p-8">
                {/* Header Halaman */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Data Pelanggan
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Kelola dan pantau semua pengguna terdaftar ({customers.length} pelanggan)
                    </p>
                </div>

                {/* Tampilan Error jika ada */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}

                {/* Kolom Pencarian */}
                <div className="max-w-xl mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari nama, email, atau nomor HP..."
                            className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                        />
                    </div>
                </div>

                {/* Skeleton Loading State */}
                {loading && (
                    <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                                        <div>
                                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2" />
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                                        </div>
                                    </div>
                                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* State Kosong (Tidak ada data / Hasil pencarian nihil) */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-16">
                        <User className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
                        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {searchTerm ? "Pelanggan Tidak Ditemukan" : "Belum Ada Pelanggan"}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchTerm ? "Coba kata kunci lain" : "Data pelanggan akan muncul di sini"}
                        </p>
                    </div>
                )}

                {/* Daftar Kartu Pelanggan */}
                {!loading && filtered.length > 0 && (
                    <div className="space-y-4">
                        {filtered.map((customer, i) => (
                            <motion.div
                                key={customer.id || customer.userId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 p-6"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                                    {/* Info Utama Pelanggan */}
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-linear-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                                            {(customer.nama || customer.name || "U").charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                                                {customer.nama || customer.name || "Pelanggan Tanpa Nama"}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                {customer.email && (
                                                    <span className="flex items-center gap-1.5">
                                                        <Mail className="w-4 h-4" /> {customer.email}
                                                    </span>
                                                )}
                                                {(customer.phone || customer.nomorTelepon) && (
                                                    <span className="flex items-center gap-1.5">
                                                        <Phone className="w-4 h-4" /> {customer.phone || customer.nomorTelepon}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status dan Aksi */}
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-2 rounded-full text-xs font-medium ${customer.isActive !== false
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                                            }`}>
                                            {customer.isActive !== false ? "Aktif" : "Nonaktif"}
                                        </span>

                                        <div className="relative">
                                            <button
                                                onClick={() => setSelectedCustomer(selectedCustomer?.id === customer.id ? null : customer)}
                                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                            >
                                                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            </button>

                                            {/* Dropdown Menu Aksi */}
                                            <AnimatePresence>
                                                {selectedCustomer?.id === customer.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-10"
                                                    >
                                                        <button 
                                                            onClick={() => handleViewDetail(customer)}
                                                            className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition"
                                                        >
                                                            <Eye className="w-4 h-4" /> Lihat Detail
                                                        </button>
                                                        <button 
                                                            onClick={handleFeatureComingSoon}
                                                            className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition"
                                                        >
                                                            <Edit className="w-4 h-4" /> Edit Profil
                                                        </button>
                                                        <button 
                                                            onClick={handleFeatureComingSoon}
                                                            className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-3 transition"
                                                        >
                                                            <Ban className="w-4 h-4" /> Nonaktifkan
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Tambahan (Statistik Pelanggan) */}
                                <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-500">Bergabung</p>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("id-ID") : "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-500">Total Pesanan</p>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {customer.totalOrders || customer.orderCount || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-500">Total Belanja</p>
                                        <p className="font-medium text-amber-600 dark:text-amber-400">
                                            {customer.totalSpent ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(customer.totalSpent) : "Rp 0"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-500">Terakhir Login</p>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {customer.lastLogin ? new Date(customer.lastLogin).toLocaleString("id-ID", {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : "-"}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Modal Detail Pelanggan */}
                <AnimatePresence>
                    {showDetailModal && detailCustomer && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                            onClick={() => setShowDetailModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                                {/* Header Modal */}
                                <div className="px-6 py-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                            {(detailCustomer.nama || detailCustomer.name || "U").charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                                {detailCustomer.nama || detailCustomer.name || "Pelanggan Tanpa Nama"}
                                            </h2>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                                                detailCustomer.isActive !== false
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                                                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                                            }`}>
                                                {detailCustomer.isActive !== false ? "Aktif" : "Nonaktif"}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                    >
                                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                </div>

                                {/* Body Modal */}
                                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                                    {/* Informasi Kontak */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                            Informasi Kontak
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                                <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {detailCustomer.email || "-"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                                <Phone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Nomor Telepon</p>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {detailCustomer.phone || detailCustomer.nomorTelepon || "-"}
                                                    </p>
                                                </div>
                                            </div>
                                            {detailCustomer.alamat && (
                                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                                    <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Alamat</p>
                                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                                            {detailCustomer.alamat}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Statistik Pelanggan */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                            Statistik
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total Pesanan</p>
                                                </div>
                                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                                    {detailCustomer.totalOrders || detailCustomer.orderCount || 0}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Total Belanja</p>
                                                </div>
                                                <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
                                                    {detailCustomer.totalSpent ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(detailCustomer.totalSpent) : "Rp 0"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informasi Akun */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                            Informasi Akun
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                                <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Bergabung Sejak</p>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {detailCustomer.createdAt ? new Date(detailCustomer.createdAt).toLocaleDateString("id-ID", {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        }) : "-"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Terakhir Login</p>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {detailCustomer.lastLogin ? new Date(detailCustomer.lastLogin).toLocaleString("id-ID", {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Modal */}
                                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="w-full px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Notifikasi Fitur Mendatang */}
                <AnimatePresence>
                    {showFeatureNotice && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-amber-100 dark:border-gray-700"
                        >
                            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-500/30 text-white">
                                <Edit className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-base">Fitur Mendatang</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Fitur ini akan segera hadir!</p>
                            </div>
                            <button
                                onClick={() => setShowFeatureNotice(false)}
                                className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
}