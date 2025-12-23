import { Heart, User, ShoppingCart, Bell, Sun, Moon, MessageCircle, Menu, X, Sparkles } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/Axios.jsx";
import AuthModal from "./AuthModal.jsx";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

/**
 * Komponen Header
 * Menampilkan navigasi utama, logo, pencarian, dan ikon pengguna (keranjang, wishlist, notifikasi).
 * Mengelola status login, tema (gelap/terang), dan koneksi WebSocket untuk notifikasi real-time.
 */
export default function Header({ setShowAuth }) {
    // State untuk menyimpan jumlah item di keranjang
    const [cartCount, setCartCount] = useState(0);
    // State untuk menyimpan jumlah item di wishlist
    const [wishlistCount, setWishlistCount] = useState(0);
    // State untuk jumlah pesan chat yang belum dibaca
    const [chatUnreadCount, setChatUnreadCount] = useState(0);
    // State untuk jumlah notifikasi sistem yang belum dibaca
    const [notificationCount, setNotificationCount] = useState(0);
    // State untuk menyimpan daftar notifikasi
    const [notifications, setNotifications] = useState([]);
    // State untuk mengontrol visibilitas dropdown notifikasi
    const [showNotifications, setShowNotifications] = useState(false);
    
    // State untuk mode gelap/terang, mengambil dari localStorage atau preferensi sistem
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem("theme");
        if (saved) return saved === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    // State untuk menu mobile (hamburger menu)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Manajemen state autentikasi lokal
    const [localShowAuth, setLocalShowAuth] = useState(false);
    const isLoggedIn = !!localStorage.getItem("user_token");

    // Menangani tampilan modal autentikasi (menggunakan prop jika ada, jika tidak pakai state lokal)
    const handleAuthShow = (show) => {
        if (setShowAuth) {
            setShowAuth(show);
        } else {
            setLocalShowAuth(show);
        }
    };

    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname || "/";
    const stompClientRef = useRef(null);
    const notificationRef = useRef(null);

    // Sinkronisasi status login antar tab/komponen
    useEffect(() => {
        const onStorage = () => {
            // Memaksa render ulang untuk memperbarui status isLoggedIn
            setCartCount((prev) => prev); 
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    // Pesan-pesan untuk marquee (teks berjalan) di bagian atas header
    const messages = [
        "Gratis ongkir seluruh Indonesia",
        "Stok ready",
        "Garansi uang kembali",
        "Bisa tukar tambah",
        "Emas murni bersertifikat",
    ];

    /**
     * Mengambil jumlah item keranjang dari server.
     * Menggunakan logika untuk menghitung item unik berdasarkan ID produk.
     */
    const fetchCartCount = useCallback(async () => {
        if (!isLoggedIn) {
            setCartCount(0);
            return;
        }
        try {
            const token = localStorage.getItem("user_token");
            const res = await api.get("/api/keranjang", { headers: { Authorization: `Bearer ${token}` } });
            const arr = Array.isArray(res.data?.data) ? res.data.data : [];
            // Menghitung jumlah produk unik
            const uniqueCount = (() => {
                const ids = new Set();
                let noIdCount = 0;
                arr.forEach(i => {
                    const id = i.produkId ?? (i.produk?.id ?? i.id);
                    if (id) ids.add(id);
                    else noIdCount++;
                });
                return ids.size + noIdCount;
            })();
            setCartCount(uniqueCount);
        } catch {
            setCartCount(0);
        }
    }, [isLoggedIn]);

    /**
     * Mengambil jumlah item wishlist dari server.
     */
    const fetchWishlistCount = useCallback(async () => {
        if (!isLoggedIn) {
            setWishlistCount(0);
            return;
        }
        try {
            const token = localStorage.getItem("user_token");
            const res = await api.get("/api/wishlist", { headers: { Authorization: `Bearer ${token}` } });
            const arr = Array.isArray(res.data?.data) ? res.data.data : [];
            setWishlistCount(arr.length);
        } catch {
            setWishlistCount(0);
        }
    }, [isLoggedIn]);

    /**
     * Mengambil jumlah pesan chat yang belum dibaca.
     */
    const fetchChatUnreadCount = useCallback(async () => {
        if (!isLoggedIn) {
            setChatUnreadCount(0);
            return;
        }
        try {
            const token = localStorage.getItem("user_token");
            const res = await api.get("/api/chat/unread-count", { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            
            // Menangani berbagai kemungkinan format respons dari backend
            let count = 0;
            if (res.data?.data?.unreadCount !== undefined) {
                count = res.data.data.unreadCount;
            } else if (res.data?.data !== undefined && typeof res.data.data === 'number') {
                count = res.data.data;
            } else if (res.data?.count !== undefined) {
                count = res.data.count;
            }
            
            console.log('[Header] Fetched chat unread count:', count);
            setChatUnreadCount(count);
        } catch (err) {
            console.error('[Header] Error fetching unread count:', err);
            setChatUnreadCount(0);
        }
    }, [isLoggedIn]);

    /**
     * Mengambil daftar notifikasi dan jumlah notifikasi belum dibaca.
     */
    const fetchNotifications = useCallback(async () => {
        if (!isLoggedIn) {
            setNotificationCount(0);
            setNotifications([]);
            return;
        }
        try {
            const token = localStorage.getItem("user_token");
            const res = await api.get("/api/user/notifications", { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            const notifData = res.data?.data || [];
            const unreadCount = res.data?.unreadCount || 0;
            setNotifications(notifData);
            setNotificationCount(unreadCount);
        } catch (err) {
            console.error('[Header] Error fetching notifications:', err);
            setNotificationCount(0);
            setNotifications([]);
        }
    }, [isLoggedIn]);

    /**
     * Menandai notifikasi spesifik sebagai sudah dibaca.
     */
    const markNotificationAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem("user_token");
            await api.put(`/api/user/notifications/${notificationId}/read`, {}, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            // Refresh notifikasi setelah update
            await fetchNotifications();
        } catch (err) {
            console.error('[Header] Error marking notification as read:', err);
        }
    };

    /**
     * Menandai semua notifikasi sebagai sudah dibaca.
     */
    const markAllNotificationsAsRead = async () => {
        try {
            const token = localStorage.getItem("user_token");
            await api.put("/api/user/notifications/mark-all-read", {}, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            // Refresh notifikasi setelah update
            await fetchNotifications();
        } catch (err) {
            console.error('[Header] Error marking all notifications as read:', err);
        }
    };

    // Effect untuk memuat data awal saat komponen dipasang
    useEffect(() => {
        fetchCartCount();
    }, [fetchCartCount]);

    useEffect(() => {
        fetchWishlistCount();
    }, [fetchWishlistCount]);

    // Effect untuk mendengarkan event custom global (untuk update real-time antar komponen)
    useEffect(() => {
        const onCartUpdate = () => fetchCartCount();
        const onWishlistUpdate = () => fetchWishlistCount();
        const onChatRead = () => setChatUnreadCount(0);
        const onChatUpdate = () => fetchChatUnreadCount();
        const onNotificationUpdate = () => fetchNotifications();
        
        window.addEventListener("cart:update", onCartUpdate);
        window.addEventListener("wishlist:update", onWishlistUpdate);
        window.addEventListener("chat:read", onChatRead);
        window.addEventListener("chat:update", onChatUpdate);
        window.addEventListener("notification:update", onNotificationUpdate);
        
        return () => {
            window.removeEventListener("cart:update", onCartUpdate);
            window.removeEventListener("wishlist:update", onWishlistUpdate);
            window.removeEventListener("chat:read", onChatRead);
            window.removeEventListener("chat:update", onChatUpdate);
            window.removeEventListener("notification:update", onNotificationUpdate);
        };
    }, [fetchCartCount, fetchWishlistCount, fetchChatUnreadCount, fetchNotifications]);

    // Mengambil jumlah chat belum dibaca saat awal
    useEffect(() => {
        fetchChatUnreadCount();
    }, [fetchChatUnreadCount]);

    // WebSocket untuk update chat dan notifikasi secara real-time
    useEffect(() => {
        if (!isLoggedIn) {
            // Bersihkan koneksi jika logout
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
            return;
        }

        const token = localStorage.getItem("user_token");
        if (!token) return;

        // Ekstrak userId dari token JWT
        let userId;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload.userId || payload.id || payload.sub;
        } catch (e) {
            console.error('[Header] Failed to extract userId from token:', e);
            return;
        }

        if (!userId) {
            console.error('[Header] No userId found in token');
            return;
        }

        console.log('[Header] Initializing WebSocket for userId:', userId);

        // Mencegah koneksi ganda
        if (stompClientRef.current && stompClientRef.current.connected) {
            console.log('[Header] WebSocket already connected, skipping');
            return;
        }

        const socketUrl = "http://localhost:8080/ws";
        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            onConnect: () => {
                console.log('[Header] WebSocket connected for chat and notifications');
                
                // Subscribe ke topik chat user untuk pesan baru
                client.subscribe(`/topic/chat/customer/${userId}`, (message) => {
                    try {
                        const msg = JSON.parse(message.body);
                        console.log('[Header] New chat message received:', msg);
                        
                        // Hanya tambah counter jika pesan dari ADMIN dan belum dibaca
                        if (msg.senderRole === 'ADMIN' && !msg.isRead) {
                            setTimeout(() => {
                                setChatUnreadCount(prev => prev + 1);
                            }, 0);
                            
                            // Tampilkan notifikasi browser jika diizinkan
                            if (Notification.permission === 'granted') {
                                new Notification('Pesan Baru dari Admin', {
                                    body: msg.message.substring(0, 100),
                                    icon: '/favicon.ico',
                                    badge: '/favicon.ico'
                                });
                            }
                        }
                    } catch (e) {
                        console.error('[Header] Error parsing chat message:', e);
                    }
                });

                // Subscribe ke topik notifikasi user
                client.subscribe(`/topic/notifications/user/${userId}`, (message) => {
                    try {
                        const notification = JSON.parse(message.body);
                        console.log('[Header] New notification received:', notification);
                        
                        // Jadwalkan update state
                        setTimeout(() => {
                            setNotificationCount(prev => prev + 1);
                            fetchNotifications();
                        }, 0);
                        
                        // Tampilkan notifikasi browser
                        if (Notification.permission === 'granted') {
                            new Notification(notification.title || 'Notifikasi Baru', {
                                body: notification.message || '',
                                icon: '/favicon.ico',
                                badge: '/favicon.ico'
                            });
                        }
                    } catch (e) {
                        console.error('[Header] Error parsing notification:', e);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('[Header] WebSocket STOMP error:', frame.headers['message']);
            },
            onWebSocketError: (event) => {
                console.error('[Header] WebSocket connection error:', event);
            },
            onDisconnect: () => {
                console.log('[Header] WebSocket disconnected');
            }
        });

        client.activate();
        stompClientRef.current = client;

        // Meminta izin notifikasi browser
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => {
            console.log('[Header] Cleaning up WebSocket');
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        };
    }, [isLoggedIn, fetchNotifications]);

    // Ambil notifikasi awal
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Polling setiap 30 detik sebagai cadangan jika WebSocket gagal
    useEffect(() => {
        if (!isLoggedIn) return;

        const interval = setInterval(() => {
            fetchChatUnreadCount();
            fetchNotifications();
        }, 30000); // 30 detik

        return () => clearInterval(interval);
    }, [isLoggedIn, fetchChatUnreadCount, fetchNotifications]);

    // Effect untuk menerapkan tema gelap/terang ke elemen HTML
    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }, [isDark]);

    // Tutup menu saat navigasi berpindah halaman
    useEffect(() => {
        setMobileMenuOpen(prev => prev ? false : prev);
        setShowNotifications(prev => prev ? false : prev);
    }, [pathname]);

    // Tutup dropdown notifikasi saat klik di luar area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    return (
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg">
            {/* Top Marquee Bar (Teks Berjalan) */}
            <div className="bg-linear-to-r from-yellow-600 via-yellow-700 to-yellow-600 text-white text-xs sm:text-sm dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-2 overflow-hidden">
                    <div className="animate-marquee whitespace-nowrap">
                        {[...messages, ...messages].map((msg, i) => (
                            <span key={i} className="mx-6 sm:mx-8 inline-flex items-center gap-2">
                                <Sparkles className="w-3 h-3" /> {msg}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Bagian Kiri: Menu & Logo */}
                    <div className="flex items-center gap-4">
                        {/* Hamburger Menu (Hanya Mobile) */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            aria-label="Buka menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center gap-2 group"
                            aria-label="Fajar Gold - Beranda"
                        >
                            <img src="/logo.svg" alt="Fajar Gold Logo" className="w-8 h-8 sm:w-10 sm:h-10 transition transform group-hover:scale-110 drop-shadow-md" />
                            <span className="text-2xl sm:text-3xl font-extrabold bg-linear-to-r from-yellow-600 via-yellow-700 to-yellow-800 bg-clip-text text-transparent group-hover:from-yellow-700 group-hover:via-yellow-800 group-hover:to-yellow-900 transition">
                                Fajar Gold
                            </span>
                        </Link>
                    </div>

                    {/* Navigasi Desktop */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-gray-700 dark:text-gray-200 font-medium order-3 md:order-2 w-full md:w-auto justify-center">
                        <Link
                            to="/katalog"
                            className={`relative hover:text-yellow-600 transition ${pathname.startsWith("/katalog") ? "text-yellow-700 dark:text-yellow-400" : ""}`}
                        >
                            Katalog
                            {pathname.startsWith("/katalog") && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-yellow-600" />}
                        </Link>
                        <Link
                            to="/pesanan"
                            className={`relative hover:text-yellow-600 transition ${pathname.startsWith("/pesanan") ? "text-yellow-700 dark:text-yellow-400" : ""}`}
                        >
                            Pesanan Saya
                            {pathname.startsWith("/pesanan") && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-yellow-600" />}
                        </Link>
                        <Link
                            to="/kontak"
                            className={`relative hover:text-yellow-600 transition ${pathname.startsWith("/kontak") ? "text-yellow-700 dark:text-yellow-400" : ""}`}
                        >
                            Kontak
                            {pathname.startsWith("/kontak") && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-yellow-600" />}
                        </Link>
                        <Link
                            to="/tentang"
                            className={`relative hover:text-yellow-600 transition ${pathname.startsWith("/tentang") ? "text-yellow-700 dark:text-yellow-400" : ""}`}
                        >
                            Tentang Kami
                            {pathname.startsWith("/tentang") && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-yellow-600" />}
                        </Link>
                    </nav>

                    {/* Ikon Kanan (Notifikasi, Chat, Wishlist, Profil, Keranjang, Tema) */}
                    <div className="flex items-center gap-2 sm:gap-4 order-2 md:order-3 ml-auto md:ml-0">
                        {/* Lonceng Notifikasi */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => {
                                    if (isLoggedIn) {
                                        setShowNotifications(!showNotifications);
                                        if (!showNotifications) {
                                            fetchNotifications();
                                        }
                                    } else {
                                        handleAuthShow(true);
                                    }
                                }}
                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
                            >
                                <Bell className={`w-5 h-5 sm:w-6 sm:h-6 ${showNotifications ? "text-yellow-600" : "text-gray-700 dark:text-gray-200"} hover:text-yellow-600 transition`} />
                                {isLoggedIn && notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow animate-pulse">
                                        {notificationCount > 99 ? '99+' : notificationCount}
                                    </span>
                                )}
                            </button>

                            {/* Dropdown Notifikasi */}
                            {showNotifications && isLoggedIn && (
                                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[70vh] overflow-hidden flex flex-col">
                                    {/* Header Dropdown */}
                                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Notifikasi</h3>
                                        {notificationCount > 0 && (
                                            <button
                                                onClick={markAllNotificationsAsRead}
                                                className="text-xs text-yellow-600 hover:text-yellow-700 font-medium"
                                            >
                                                Tandai Semua Dibaca
                                            </button>
                                        )}
                                    </div>

                                    {/* Daftar Notifikasi */}
                                    <div className="overflow-y-auto flex-1">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                                <p className="text-sm">Tidak ada notifikasi</p>
                                            </div>
                                        ) : (
                                            notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => {
                                                        if (!notif.isRead) {
                                                            markNotificationAsRead(notif.id);
                                                        }
                                                        // Navigasi berdasarkan tipe notifikasi
                                                        if (notif.paymentId) {
                                                            navigate(`/pesanan`);
                                                        }
                                                        setShowNotifications(false);
                                                    }}
                                                    className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${
                                                        !notif.isRead ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                                            !notif.isRead ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'
                                                        }`} />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                                                                {notif.title}
                                                            </h4>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                                                {notif.message}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                                {new Date(notif.timestamp).toLocaleString('id-ID', {
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tombol Chat */}
                        <button
                            onClick={() => (isLoggedIn ? navigate("/chat") : handleAuthShow(true))}
                            className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            <MessageCircle className={`w-5 h-5 sm:w-6 sm:h-6 ${pathname.startsWith("/chat") ? "text-yellow-600" : "text-gray-700 dark:text-gray-200"} hover:text-yellow-600 transition`} />
                            {isLoggedIn && chatUnreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow animate-pulse">
                                    {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
                                </span>
                            )}
                        </button>

                        {/* Tombol Wishlist */}
                        <button
                            onClick={() => (isLoggedIn ? navigate("/wishlist") : handleAuthShow(true))}
                            className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${pathname.startsWith("/wishlist") ? "text-yellow-600" : "text-gray-700 dark:text-gray-200"} hover:text-yellow-600 transition`} />
                            {isLoggedIn && wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow">
                                    {wishlistCount}
                                </span>
                            )}
                        </button>

                        {/* Tombol Profil */}
                        <button
                            onClick={() => (isLoggedIn ? navigate("/profile") : handleAuthShow(true))}
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            <User className={`w-5 h-5 sm:w-6 sm:h-6 ${pathname.startsWith("/profile") ? "text-yellow-600" : "text-gray-700 dark:text-gray-200"} hover:text-yellow-600 transition`} />
                        </button>

                        {/* Tombol Keranjang */}
                        <button
                            onClick={() => {
                                if (isLoggedIn) {
                                    fetchCartCount();
                                    navigate("/keranjang");
                                } else {
                                    handleAuthShow(true);
                                }
                            }}
                            className="relative"
                        >
                            <div className={`p-2 sm:p-3 rounded-2xl bg-linear-to-r from-yellow-500 via-yellow-600 to-yellow-500 shadow-lg hover:shadow-xl transition-all ${pathname.startsWith("/keranjang") ? "ring-2 ring-white" : ""}`}>
                                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </button>

                        {/* Toggle Tema (Gelap/Terang) */}
                        <button
                            onClick={() => setIsDark((v) => !v)}
                            className="relative w-12 sm:w-16 h-7 sm:h-9 rounded-full bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-yellow-600 dark:via-amber-600 dark:to-yellow-600 p-1 shadow-lg hover:shadow-xl transition-all duration-500"
                            aria-label="Ganti tema"
                        >
                            <div
                                className={`absolute top-1 left-1 w-5 sm:w-7 h-5 sm:h-7 rounded-full bg-white dark:bg-gray-900 shadow-md flex items-center justify-center transition-all duration-500 ease-in-out ${isDark ? "translate-x-5 sm:translate-x-7" : "translate-x-0"}`}
                            >
                                <div className="relative w-3 sm:w-5 h-3 sm:h-5">
                                    <Sun className={`absolute inset-0 w-full h-full text-yellow-500 transition-all duration-700 ${isDark ? "opacity-0 rotate-180 scale-0" : "opacity-100 rotate-0 scale-100"}`} />
                                    <Moon className={`absolute inset-0 w-full h-full text-amber-200 transition-all duration-700 ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-0"}`} />
                                </div>
                            </div>
                            {isDark && (
                                <div className="absolute inset-0 rounded-full overflow-hidden">
                                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-300 rounded-full blur-md animate-ping" />
                                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-amber-400 rounded-full blur-md animate-ping delay-300" />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Mobile (Hamburger) */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-700">
                    <nav className="px-6 py-5 space-y-4">
                        <Link
                            to="/katalog"
                            className={`block py-3 text-lg font-medium hover:text-yellow-600 transition ${pathname.startsWith("/katalog") ? "text-yellow-700 dark:text-yellow-400" : "text-gray-800 dark:text-gray-200"}`}
                        >
                            Katalog
                        </Link>
                        <Link
                            to="/pesanan"
                            className={`block py-3 text-lg font-medium hover:text-yellow-600 transition ${pathname.startsWith("/pesanan") ? "text-yellow-700 dark:text-yellow-400" : "text-gray-800 dark:text-gray-200"}`}
                        >
                            Pesanan Saya
                        </Link>
                        <Link
                            to="/kontak"
                            className={`block py-3 text-lg font-medium hover:text-yellow-600 transition ${pathname.startsWith("/kontak") ? "text-yellow-700 dark:text-yellow-400" : "text-gray-800 dark:text-gray-200"}`}
                        >
                            Kontak
                        </Link>
                        <Link
                            to="/tentang"
                            className={`block py-3 text-lg font-medium hover:text-yellow-600 transition ${pathname.startsWith("/tentang") ? "text-yellow-700 dark:text-yellow-400" : "text-gray-800 dark:text-gray-200"}`}
                        >
                            Tentang Kami
                        </Link>
                    </nav>
                </div>
            )}

            {/* Modal Autentikasi (Login/Register) */}
            {!setShowAuth && (
                <AuthModal 
                    open={localShowAuth} 
                    onClose={() => setLocalShowAuth(false)} 
                    onSuccess={() => {
                        // Perbarui data keranjang dan wishlist setelah login berhasil
                        fetchCartCount();
                        fetchWishlistCount();
                        fetchNotifications();
                    }} 
                />
            )}
        </header>
    );
}
