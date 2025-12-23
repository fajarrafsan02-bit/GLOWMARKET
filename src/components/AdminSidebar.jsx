import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  MessageCircle,
  X
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import api from "../api/Axios.jsx";

/**
 * Komponen AdminSidebar
 *
 * Komponen ini menangani navigasi sidebar untuk dashboard admin.
 * Mendukung tampilan responsif (sidebar tetap di desktop, drawer di mobile).
 * Menampilkan menu navigasi, jumlah chat yang belum dibaca, dan tombol logout.
 *
 * @param {string} activeMenu - Kunci menu yang sedang aktif
 * @param {function} onLogout - Fungsi untuk menangani logout
 * @param {boolean} mobileOpen - State untuk mengontrol visibilitas sidebar di mobile
 * @param {function} setMobileOpen - Fungsi untuk mengubah state mobileOpen
 */
export default function AdminSidebar({ activeMenu, onLogout, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  // State untuk menyimpan jumlah pesan belum dibaca
  const [unreadCount, setUnreadCount] = useState(0);

  // State untuk menampilkan notifikasi fitur yang belum tersedia
  const [showFeatureNotice, setShowFeatureNotice] = useState(false);

  /**
   * Mengambil jumlah pesan yang belum dibaca dari server
   * Dijalankan saat komponen dimuat dan setiap 5 detik (polling)
   */
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) return;

        const res = await api.get("/api/chat/unread-count", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Format respons: { success: true, message: "...", data: { unreadCount: 5 } }
        const count = res.data?.data?.unreadCount || 0;
        setUnreadCount(count);
      } catch (error) {
        console.error("Gagal mengambil jumlah pesan belum dibaca", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 5000); // Polling setiap 5 detik

    return () => clearInterval(interval); // Bersihkan interval saat komponen di-unmount
  }, []);

  // Daftar menu navigasi
  const menu = [
    { key: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { key: "products", icon: Package, label: "Produk", path: "/admin/products" },
    { key: "orders", icon: ShoppingBag, label: "Pesanan", path: "/admin/orders" },
    { key: "customers", icon: Users, label: "Pelanggan", path: "/admin/pelanggan" },
    { key: "reports", icon: BarChart3, label: "Laporan", path: "/admin/laporan" },
    { key: "settings", icon: Settings, label: "Pengaturan", path: "/admin/settings" },
  ];

  /**
   * Menangani klik pada item menu
   * @param {object} item - Objek item menu
   * @param {boolean} isMobile - Apakah diklik dari tampilan mobile
   */
  const handleMenuClick = (item, isMobile = false) => {
    if (item.key === "settings") {
      setShowFeatureNotice(true);
      setTimeout(() => setShowFeatureNotice(false), 3000);
      if (isMobile) setMobileOpen(false);
    } else if (item.path) {
      navigate(item.path);
      if (isMobile) setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar Desktop - Tersembunyi di mobile, tampil di layar md ke atas */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">

        {/* Header Sidebar */}
        <div className="p-5 border-b border-gray-300 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-linear-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Fajar Gold</h1>
              <p className="text-xs text-yellow-400">Panel Admin</p>
            </div>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 py-3 px-2">
          <div className="space-y-1">
            {menu.map((item) => (
              <Motion.button
                key={item.key}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMenuClick(item)}
                className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                  activeMenu === item.key
                    ? "bg-linear-to-r from-yellow-600 to-amber-600 text-white shadow-lg shadow-yellow-600/30"
                    : "text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>

                {/* Indikator Aktif (Garis Emas di Kanan) */}
                {activeMenu === item.key && (
                  <Motion.div
                    layoutId="sidebarActiveIndicator"
                    className="absolute right-0 top-0 bottom-0 w-1.5 bg-yellow-400 rounded-l-md"
                  />
                )}
              </Motion.button>
            ))}
          </div>
        </nav>

        {/* Bagian Bawah: Chat & Logout */}
        <div className="p-3 border-t border-gray-300 dark:border-gray-800 space-y-2">
          {/* Tombol Chat */}
          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/admin/chat")}
            className="relative w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-linear-to-r from-green-600 to-emerald-600 text-white font-medium shadow-md overflow-hidden"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm flex-1 text-left">Chat Pelanggan</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse shrink-0">
                {unreadCount}
              </span>
            )}
          </Motion.button>

          {/* Tombol Logout */}
          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-linear-to-r from-red-600 to-rose-600 text-white font-medium shadow-md"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Keluar</span>
          </Motion.button>
        </div>
      </aside>

      {/* Mobile Drawer - Tampil saat mobileOpen bernilai true */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay Gelap */}
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black"
            />

            {/* Sidebar Mobile */}
            <Motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-50 w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white shadow-2xl flex flex-col"
            >
              {/* Header Mobile */}
              <div className="p-4 border-b border-gray-300 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-linear-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-base font-bold">Fajar Gold</h1>
                    <p className="text-[11px] text-yellow-500">Panel Admin</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
                  aria-label="Tutup sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Navigasi Mobile */}
              <nav className="flex-1 py-3 px-2 overflow-y-auto">
                <div className="space-y-1">
                  {menu.map((item) => (
                    <Motion.button
                      key={item.key}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMenuClick(item, true)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                        activeMenu === item.key
                          ? "bg-linear-to-r from-yellow-600 to-amber-600 text-white shadow"
                          : "text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Motion.button>
                  ))}
                </div>
              </nav>

              {/* Tombol Aksi Mobile */}
              <div className="p-3 border-t border-gray-300 dark:border-gray-800 space-y-2">
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate("/admin/chat");
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-linear-to-r from-green-600 to-emerald-600 text-white text-sm font-medium"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  <span className="flex-1 text-left">Chat Pelanggan</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse shrink-0">
                      {unreadCount}
                    </span>
                  )}
                </Motion.button>
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-linear-to-r from-red-600 to-rose-600 text-white text-sm font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Keluar</span>
                </Motion.button>
              </div>
            </Motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Notifikasi Fitur Mendatang */}
      <AnimatePresence>
        {showFeatureNotice && (
          <Motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-60 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-amber-100 dark:border-gray-700"
          >
            <div className="p-3 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-500/30 text-white">
               <Settings className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base">Fitur Mendatang</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Menu Pengaturan akan segera hadir!</p>
            </div>
            <button
              onClick={() => setShowFeatureNotice(false)}
              className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
