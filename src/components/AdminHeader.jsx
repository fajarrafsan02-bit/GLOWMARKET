import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, Sun, Moon, X } from "lucide-react";
import api from "../api/Axios.jsx";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useWebSocket } from "../hooks/useWebSocket";

/**
 * Komponen AdminHeader
 * Menampilkan header untuk halaman admin termasuk toggle sidebar, judul,
 * toggle tema (gelap/terang), notifikasi, dan profil admin.
 */
export default function AdminHeader({ title, isDarkMode, onToggleDark, adminName, onToggleSidebar }) {
  const navigate = useNavigate();
  
  // State untuk menyimpan jumlah notifikasi belum dibaca
  const [notifCount, setNotifCount] = useState(0);
  // State untuk menyimpan daftar notifikasi
  const [notifications, setNotifications] = useState([]);
  // State untuk mengontrol visibilitas dropdown notifikasi
  const [showNotifList, setShowNotifList] = useState(false);

  /**
   * Fungsi untuk mengambil ulang notifikasi dari server.
   * Digunakan saat inisialisasi atau setelah melakukan aksi (misal: tandai dibaca).
   * Menggunakan useCallback agar referensi fungsi stabil dan tidak memicu render ulang yang tidak perlu.
   */
  const refetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      const headers = { headers: { Authorization: `Bearer ${token}` } };
      
      // Request ke API untuk mendapatkan notifikasi terbaru
      const response = await api.get("/api/admin/notifications", headers);
      
      if (response.data.success) {
        // Update state notifikasi dan jumlah belum dibaca
        const notifs = response.data.data || [];
        setNotifications(notifs);
        setNotifCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Gagal mengambil notifikasi:", error);
    }
  }, []);

  /**
   * Handler untuk menangani notifikasi baru yang masuk via WebSocket.
   * Menambahkan notifikasi baru ke awal daftar dan menambah counter.
   */
  const handleNewNotification = useCallback((notification) => {
    // Tambahkan notifikasi baru di paling atas, batasi maksimal 50 item
    setNotifications(prev => [notification, ...prev].slice(0, 50));
    
    // Jika notifikasi belum dibaca, tambah counter
    if (!notification.isRead) {
      setNotifCount(prev => prev + 1);
    }
  }, []);

  // Inisialisasi koneksi WebSocket untuk real-time updates
  const { isConnected } = useWebSocket(
    "http://localhost:8080/ws",
    "/topic/admin/notifications",
    handleNewNotification
  );

  /**
   * Effect untuk meminta izin notifikasi browser saat komponen dimuat pertama kali.
   */
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  /**
   * Effect untuk memuat notifikasi awal saat komponen dimuat.
   */
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) return;

        const headers = { headers: { Authorization: `Bearer ${token}` } };
        
        // Cek stok rendah terlebih dahulu (trigger backend check)
        try {
            await api.get("/api/admin/notifications/check-low-stock", headers);
        } catch (e) {
            console.warn("Gagal pengecekan stok rendah", e);
        }

        // Ambil data notifikasi
        const response = await api.get("/api/admin/notifications", headers);
        
        if (response.data.success) {
          const notifs = response.data.data || [];
          setNotifications(notifs);
          setNotifCount(response.data.unreadCount || 0);
        }
      } catch (error) {
        console.error("Gagal memuat notifikasi:", error);
      }
    };

    loadNotifications();
  }, []); // Dependency array kosong artinya hanya jalan sekali saat mount

  /**
   * Fungsi untuk menandai semua notifikasi sebagai sudah dibaca.
   */
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      await api.put("/api/admin/notifications/mark-all-read", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh data notifikasi setelah update
      setTimeout(() => refetchNotifications(), 0);
    } catch (error) {
      console.error("Gagal menandai semua dibaca:", error);
    }
  };

  /**
   * Fungsi untuk menandai satu notifikasi spesifik sebagai dibaca.
   * Kemudian mengarahkan pengguna ke halaman terkait.
   */
  const markAsRead = async (notif) => {
    // Jika sudah dibaca, langsung navigasi saja
    if (notif.isRead) {
      navigateToNotification(notif);
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      // Call API mark as read
      await api.put(`/api/admin/notifications/${notif.id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh list notifikasi
      setTimeout(() => refetchNotifications(), 0);
      
      // Navigasi ke halaman terkait
      navigateToNotification(notif);
    } catch (error) {
      console.error("Gagal menandai dibaca:", error);
      navigateToNotification(notif); // Tetap navigasi meski error network
    }
  };

  /**
   * Helper navigasi berdasarkan tipe notifikasi.
   */
  const navigateToNotification = (notif) => {
    if (notif.type === 'NEW_ORDER') {
      navigate('/admin/orders');
    } else if (notif.type === 'NEW_CUSTOMER') {
      navigate('/admin/pelanggan');
    } else if (notif.type === 'LOW_STOCK') {
      navigate('/admin/products');
    }
    // Tutup dropdown notifikasi setelah klik
    setShowNotifList(false);
  };

  /**
   * Helper format waktu relatif (misal: "5 menit lalu").
   */
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    return `${days} hari lalu`;
  };

  /**
   * Komponen render item notifikasi untuk menghindari duplikasi kode.
   */
  const NotificationItem = ({ notif, index }) => (
    <Motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => markAsRead(notif)}
      className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
        !notif.isRead ? "bg-blue-50 dark:bg-blue-900/30" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Indikator warna berdasarkan tipe notifikasi */}
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
          notif.type === 'NEW_ORDER' ? 'bg-green-500' : 
          notif.type === 'LOW_STOCK' ? 'bg-red-500' : 'bg-blue-500'
        } ${!notif.isRead ? 'animate-pulse' : ''}`} />
        
        <div className="flex-1">
          <p className={`text-sm font-medium ${
            !notif.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
          }`}>
            {notif.title}
          </p>
          <p className={`text-xs mt-1 ${
            !notif.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'
          }`}>
            {notif.message}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {formatTime(notif.timestamp)}
          </p>
        </div>
      </div>
    </Motion.button>
  );

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Layout Mobile: Grid 2x2 */}
          <div className="md:hidden grid grid-cols-2 grid-rows-2 gap-3">
            {/* Kiri-Atas: Judul Halaman */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            
            {/* Kanan-Atas: Ikon Profil */}
            <div className="justify-self-end">
              <div className="w-10 h-10 bg-linear-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {adminName.charAt(0).toUpperCase()}
              </div>
            </div>
            
            {/* Kiri-Bawah: Tombol Sidebar */}
            <div>
              <button
                onClick={onToggleSidebar}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </button>
            </div>
            
            {/* Kanan-Bawah: Toggle Tema + Notifikasi */}
            <div className="justify-self-end flex items-center gap-3">
              <button
                onClick={onToggleDark}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowNotifList(!showNotifList)}
                  className="relative p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  {/* Badge Jumlah Notifikasi */}
                  {notifCount > 0 && (
                    <Motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {notifCount > 99 ? '99+' : notifCount}
                    </Motion.span>
                  )}
                  {/* Indikator Koneksi WebSocket */}
                  {isConnected && (
                    <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                  )}
                </button>
                
                {/* Dropdown Notifikasi Desktop (Hidden di mobile) */}
                <AnimatePresence>
                  {showNotifList && (
                    <Motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="hidden md:flex absolute right-0 mt-2 w-96 max-h-96 rounded-xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 overflow-hidden flex-col"
                    >
                      {/* Header Notifikasi */}
                      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Notifikasi</h3>
                        <div className="flex items-center gap-3">
                          {notifCount > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAllAsRead();
                              }}
                              className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
                            >
                              Tandai semua dibaca
                            </button>
                          )}
                          <button
                            onClick={() => setShowNotifList(false)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-lg"
                            aria-label="Close notifications"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* List Notifikasi */}
                      <div className="flex-1 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                            Belum ada notifikasi
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {notifications.map((notif, i) => (
                              <NotificationItem key={notif.id || i} notif={notif} index={i} />
                            ))}
                          </div>
                        )}
                      </div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Layout Desktop */}
          <div className="hidden md:flex md:items-center md:justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            <div className="flex items-center gap-3">
              {/* Notifikasi Desktop */}
              <div className="relative z-50">
                <button
                  onClick={() => setShowNotifList(!showNotifList)}
                  className="relative p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  {notifCount > 0 && (
                    <Motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {notifCount > 99 ? '99+' : notifCount}
                    </Motion.span>
                  )}
                  {isConnected && (
                    <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                  )}
                </button>

                {/* Dropdown Notifikasi Desktop */}
                <AnimatePresence>
                  {showNotifList && (
                    <Motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="hidden md:block absolute right-0 top-full mt-2 w-96 max-h-96 rounded-xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Notifikasi</h3>
                        <div className="flex items-center gap-3">
                          {notifCount > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAllAsRead();
                              }}
                              className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
                            >
                              Tandai semua dibaca
                            </button>
                          )}
                          <button
                            onClick={() => setShowNotifList(false)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                            Belum ada notifikasi
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {notifications.map((notif, i) => (
                              <NotificationItem key={notif.id || i} notif={notif} index={i} />
                            ))}
                          </div>
                        )}
                      </div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Toggle Tema Desktop */}
              <button
                onClick={onToggleDark}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Profil Admin Desktop */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {adminName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Panel Notifikasi Mobile (Fullscreen Overlay) */}
      <AnimatePresence>
        {showNotifList && (
          <>
            {/* Background Gelap (Overlay) */}
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifList(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Panel Konten Notifikasi Mobile */}
            <Motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 overflow-hidden flex flex-col"
            >
              {/* Header Panel Mobile */}
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Notifikasi</h3>
                <div className="flex items-center gap-3">
                  {notifCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAllAsRead();
                      }}
                      className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      Tandai semua dibaca
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifList(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* List Notifikasi Mobile */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    Belum ada notifikasi
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map((notif, i) => (
                      <NotificationItem key={notif.id || i} notif={notif} index={i} />
                    ))}
                  </div>
                )}
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
