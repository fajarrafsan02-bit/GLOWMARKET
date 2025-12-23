import { useEffect, useState, useRef } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import { Search, Send, Phone, Video, MoreVertical, Paperclip, MessageCircle } from "lucide-react";
import api from "../api/Axios.jsx";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

/**
 * AdminChat Component
 * 
 * Komponen halaman chat untuk admin berkomunikasi dengan customer.
 * Fitur utama:
 * - Real-time chat menggunakan WebSocket (STOMP)
 * - Status online/offline customer secara real-time
 * - Notifikasi pesan belum dibaca (unread count)
 * - Auto mark as read ketika chat dibuka
 * - Search/filter customer
 * - Polling backup untuk online status jika WebSocket gagal
 */
export default function AdminChat() {
    // ============ STATE MANAGEMENT ============

    // State untuk customer yang sedang dipilih/dibuka chat-nya
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // State untuk input pesan yang sedang diketik
    const [message, setMessage] = useState("");

    // State untuk search/filter customer di sidebar
    const [searchQuery, setSearchQuery] = useState("");

    // ============ REAL DATA STATES ============

    // State untuk daftar semua conversation/percakapan
    // Struktur data: [{ userId, userName, userEmail, lastMessage, lastMessageTime, unreadCount, isOnline }]
    const [conversations, setConversations] = useState([]);

    // State untuk daftar pesan dalam chat yang sedang dibuka
    // Struktur data: [{ id, senderId, receiverId, senderRole, message, createdAt, isRead }]
    const [messages, setMessages] = useState([]);

    // State untuk profil admin yang sedang login
    // Diperlukan untuk subscribe ke WebSocket topic admin dan identifikasi pesan
    const [adminProfile, setAdminProfile] = useState(null);

    // ============ REFS ============

    // Ref untuk menyimpan instance STOMP client WebSocket
    // Menggunakan ref agar tidak trigger re-render dan bisa diakses di berbagai function
    const stompClientRef = useRef(null);

    // Ref untuk menyimpan selectedCustomer terkini
    // Diperlukan untuk akses nilai terbaru di callback WebSocket (menghindari stale closure)
    const selectedCustomerRef = useRef(null);

    // Ref untuk auto-scroll ke pesan terbaru
    const messagesEndRef = useRef(null);

    // Ref untuk interval polling online status (backup mechanism)
    const onlineStatusPollingRef = useRef(null);

    // ============ SYNC SELECTED CUSTOMER REF ============
    // Effect ini menjaga agar ref selalu sinkron dengan state selectedCustomer
    // Diperlukan karena WebSocket callback membaca dari ref (bukan state) untuk menghindari stale closure
    useEffect(() => {
        selectedCustomerRef.current = selectedCustomer;
    }, [selectedCustomer]);

    // ============ AUTO SCROLL TO BOTTOM ============
    // Function untuk scroll otomatis ke pesan terbaru
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Effect untuk auto-scroll setiap kali ada pesan baru
    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Trigger scroll ketika messages berubah

    // ============ FETCH INITIAL DATA & POLLING ============
    // Effect ini berjalan sekali saat component mount untuk:
    // 1. Fetch profil admin yang sedang login
    // 2. Fetch semua conversation/chat
    // 3. Fetch online status semua user
    // 4. Setup polling untuk sync online status secara periodik
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // -------- FETCH ADMIN PROFILE --------
                const profileRes = await api.get("/api/user/admin-profile");
                // Backend bisa return di data.data atau langsung di data
                const profile = profileRes.data.data || profileRes.data;
                setAdminProfile(profile);
                console.log("[AdminChat] Admin Profile:", profile);

                // -------- FETCH CONVERSATIONS --------
                const convRes = await api.get("/api/chat/conversations");
                const convData = convRes.data.data || convRes.data;
                // Pastikan convData adalah array (defensive programming)
                const conversations = Array.isArray(convData) ? convData : [];

                // -------- FETCH ONLINE USERS --------
                // Ambil daftar user yang sedang online dari backend
                try {
                    const onlineRes = await api.get("/api/chat/online-users");
                    const onlineUsers = onlineRes.data.data || [];
                    // Convert ke Set untuk O(1) lookup performance
                    const onlineUserIds = new Set(onlineUsers.map(u => u.id));

                    console.log("[AdminChat] Online user IDs:", Array.from(onlineUserIds));

                    // Merge online status dengan conversations
                    // Set isOnline=true jika userId ada di Set onlineUserIds
                    const conversationsWithStatus = conversations.map(conv => ({
                        ...conv,
                        isOnline: onlineUserIds.has(conv.userId)
                    }));

                    setConversations(conversationsWithStatus);
                } catch (err) {
                    console.error("[AdminChat] Error fetching online users:", err);
                    // Fallback: jika gagal fetch online users, set semua offline
                    setConversations(conversations.map(conv => ({ ...conv, isOnline: false })));
                }
            } catch (error) {
                console.error("[AdminChat] Error fetching initial data:", error);
                // Handle unauthorized/forbidden (token expired/invalid)
                if (error.response?.status === 401 || error.response?.status === 403) {
                    console.error("[AdminChat] Token expired or unauthorized. Redirecting to login...");
                    // Clear admin data dan redirect ke login
                    localStorage.removeItem("admin_token");
                    localStorage.removeItem("admin_email");
                    localStorage.removeItem("admin_nama");
                    window.location.href = "/admin/login";
                }
            }
        };

        // Jalankan fetch initial data
        fetchInitialData();

        // -------- SETUP POLLING FOR ONLINE STATUS --------
        // Polling adalah backup mechanism jika WebSocket gagal
        // Polling berjalan setiap 15 detik untuk sync online status
        const startOnlineStatusPolling = () => {
            onlineStatusPollingRef.current = setInterval(async () => {
                try {
                    // Fetch online users dari backend
                    const onlineRes = await api.get("/api/chat/online-users");
                    const onlineUsers = onlineRes.data.data || [];
                    const onlineUserIds = new Set(onlineUsers.map(u => u.id));

                    // Update conversations dengan status online terbaru
                    setConversations((prev) =>
                        prev.map(conv => ({
                            ...conv,
                            isOnline: onlineUserIds.has(conv.userId)
                        }))
                    );

                    // Update selectedCustomer juga jika ada
                    setSelectedCustomer((prevSelected) => {
                        if (prevSelected) {
                            return {
                                ...prevSelected,
                                isOnline: onlineUserIds.has(prevSelected.userId)
                            };
                        }
                        return prevSelected;
                    });
                } catch (err) {
                    console.error("[AdminChat] Error polling online status:", err);
                }
            }, 15000); // Poll every 15 seconds
        };

        // Start polling
        startOnlineStatusPolling();

        // Cleanup function: clear interval saat component unmount
        return () => {
            if (onlineStatusPollingRef.current) {
                clearInterval(onlineStatusPollingRef.current);
            }
        };
    }, []); // Empty dependency: hanya run sekali saat mount

    // ============ HANDLE INCOMING MESSAGE ============
    /**
     * Function untuk menangani pesan baru yang masuk dari WebSocket
     * Dipanggil oleh WebSocket subscription callback
     * 
     * @param {Object} newMsg - Pesan baru dari WebSocket
     * @param {number} newMsg.id - ID pesan
     * @param {number} newMsg.senderId - ID pengirim
     * @param {number} newMsg.receiverId - ID penerima
     * @param {string} newMsg.senderRole - Role pengirim (USER/ADMIN)
     * @param {string} newMsg.message - Isi pesan
     * @param {string} newMsg.createdAt - Waktu kirim
     * @param {boolean} newMsg.isRead - Status sudah dibaca atau belum
     */
    const handleIncomingMessage = async (newMsg) => {
        // Ambil customer yang sedang dipilih dari ref (bukan state)
        // Menggunakan ref untuk menghindari stale closure di WebSocket callback
        const currentSelected = selectedCustomerRef.current;

        // Cek apakah pesan ini dari/untuk customer yang sedang dibuka
        // Pesan bisa dari customer (senderId = customer) atau dari admin lain (receiverId = customer)
        const isFromSelected = currentSelected &&
            (newMsg.senderId === currentSelected.userId ||
                newMsg.receiverId === currentSelected.userId);

        // -------- AUTO MARK AS READ --------
        // Jika pesan dari customer yang sedang dibuka chat-nya, langsung mark as read
        if (isFromSelected && newMsg.senderRole === "USER") {
            try {
                // Call API untuk mark messages dari customer ini sebagai sudah dibaca
                await api.post(`/api/chat/mark-read?senderId=${newMsg.senderId}`);
                // Update status lokal agar UI langsung menampilkan centang biru (jika ada indikator)
                newMsg.isRead = true;
            } catch (e) {
                console.error("Gagal menandai pesan terbaca:", e);
            }
        }

        // -------- UPDATE MESSAGES LIST --------
        // Tambahkan pesan ke list jika untuk customer yang sedang dibuka
        setMessages((prev) => {
            // Jika pesan untuk customer yang sedang dibuka, tambahkan ke list
            if (isFromSelected) {
                // Cek duplikasi berdasarkan ID untuk menghindari pesan ganda
                const exists = prev.some(m => m.id === newMsg.id);
                if (exists) return prev; // Skip jika sudah ada
                return [...prev, newMsg]; // Tambahkan pesan baru
            }
            return prev; // Tidak update jika bukan untuk customer yang dibuka
        });

        // -------- UPDATE CONVERSATIONS LIST --------
        // Update last message dan unread count di sidebar conversations
        setConversations((prev) => {
            // Tentukan siapa customer-nya (bisa senderId atau receiverId tergantung arah pesan)
            // Jika senderId = admin, berarti receiverId = customer. Vice versa.
            const senderId = newMsg.senderId === adminProfile?.id
                ? newMsg.receiverId
                : newMsg.senderId;

            // Cari conversation yang sudah ada berdasarkan userId
            const existingConvIndex = prev.findIndex(c => c.userId === senderId);

            // -------- UPDATE EXISTING CONVERSATION --------
            if (existingConvIndex >= 0) {
                const updatedConv = [...prev];
                const conv = updatedConv[existingConvIndex];

                // Hitung unread count baru:
                // - Jika sedang dibuka (currentSelected), unreadCount = 0
                // - Jika tidak dibuka, tambah 1
                const newUnreadCount = (currentSelected?.userId === senderId)
                    ? 0
                    : (conv.unreadCount + 1);

                // Update conversation dengan data terbaru
                updatedConv[existingConvIndex] = {
                    ...conv,
                    lastMessage: newMsg.message,
                    lastMessageTime: newMsg.createdAt,
                    unreadCount: newUnreadCount
                };

                // Sort ulang: conversation dengan pesan terbaru di atas
                updatedConv.sort((a, b) =>
                    new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
                );
                return updatedConv;
            }
            // -------- ADD NEW CONVERSATION --------
            // Jika conversation belum ada (customer baru pertama kali chat)
            else {
                // Hanya tambahkan jika pesan dari USER (bukan dari admin)
                if (newMsg.senderRole === "USER") {
                    const newConv = {
                        userId: senderId,
                        userName: newMsg.senderName || "Pelanggan Baru",
                        userEmail: newMsg.senderEmail || "",
                        lastMessage: newMsg.message,
                        lastMessageTime: newMsg.createdAt,
                        unreadCount: 1,
                        isOnline: true // Assume online karena baru saja kirim pesan
                    };
                    // Tambahkan di paling atas (array spread dengan newConv di awal)
                    return [newConv, ...prev];
                }
                return prev; // Tidak ada perubahan jika pesan dari admin
            }
        });
    };

    // 2. Connect WebSocket
    // Effect ini menangani koneksi WebSocket untuk real-time chat
    // Dijalankan ketika adminProfile tersedia (setelah login berhasil)
    useEffect(() => {
        // Guard: Jika belum ada adminProfile, jangan lanjutkan
        // adminProfile diperlukan untuk subscribe ke topic chat admin
        if (!adminProfile) return;

        // Ambil token autentikasi admin dari localStorage
        const token = localStorage.getItem("admin_token");

        // URL endpoint WebSocket backend
        const socketUrl = "http://localhost:8080/ws";

        // Buat instance STOMP client untuk WebSocket connection
        const client = new Client({
            // Factory function untuk membuat WebSocket connection menggunakan SockJS
            // SockJS adalah library yang menyediakan fallback jika WebSocket tidak support
            webSocketFactory: () => new SockJS(socketUrl),

            // Header autentikasi yang dikirim saat koneksi
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },

            // Callback yang dipanggil ketika koneksi WebSocket berhasil
            onConnect: () => {
                console.log("[AdminChat] WebSocket Connected");

                // SUBSCRIPTION 1: Subscribe ke topic chat admin
                // Topic ini menerima pesan yang dikirim ke admin tertentu
                // Format: /topic/chat/admin/{adminId}
                client.subscribe(`/topic/chat/admin/${adminProfile.id}`, (message) => {
                    // Parse pesan JSON yang diterima dari server
                    const receivedMsg = JSON.parse(message.body);

                    // Panggil function untuk menangani pesan masuk
                    // Function ini akan update UI dan mark as read jika perlu
                    handleIncomingMessage(receivedMsg);
                });

                // SUBSCRIPTION 2: Subscribe ke topic user presence (online/offline status)
                // Topic ini broadcast status online/offline semua user
                client.subscribe("/topic/user.presence", (message) => {
                    // Parse data presence update dari server
                    const presenceUpdate = JSON.parse(message.body);
                    console.log("[AdminChat] Presence update:", presenceUpdate);

                    // Update status online di daftar conversations
                    // Menggunakan functional update untuk menghindari stale closure
                    setConversations((prev) =>
                        prev.map(conv => {
                            // Cocokkan user berdasarkan userId ATAU email
                            // Karena backend bisa send salah satu atau keduanya
                            const isMatch = conv.userId === presenceUpdate.userId ||
                                conv.userEmail === presenceUpdate.email;

                            // Jika cocok, update status online
                            if (isMatch) {
                                console.log(`[AdminChat] Updating user ${conv.userName} (${conv.userId}) status to ${presenceUpdate.status}`);
                                return {
                                    ...conv,
                                    isOnline: presenceUpdate.status === "ONLINE"
                                };
                            }
                            // Jika tidak cocok, kembalikan conversation tanpa perubahan
                            return conv;
                        })
                    );

                    // Update juga selectedCustomer jika user yang sama sedang dipilih
                    // Ini untuk update status online di header chat window
                    setSelectedCustomer((prevSelected) => {
                        if (prevSelected &&
                            (prevSelected.userId === presenceUpdate.userId ||
                                prevSelected.userEmail === presenceUpdate.email)) {
                            return {
                                ...prevSelected,
                                isOnline: presenceUpdate.status === "ONLINE"
                            };
                        }
                        return prevSelected;
                    });
                });
            },

            // Callback error jika ada masalah dengan STOMP protocol
            onStompError: (frame) => {
                console.error("Broker reported error: " + frame.headers["message"]);
                console.error("Additional details: " + frame.body);
            },
        });

        // Aktivasi koneksi WebSocket
        client.activate();

        // Simpan reference client ke ref agar bisa diakses di function lain
        stompClientRef.current = client;

        // Cleanup function: dipanggil saat component unmount atau adminProfile berubah
        return () => {
            // Deaktivasi koneksi WebSocket untuk mencegah memory leak
            if (client) client.deactivate();
            // Clear reference
            stompClientRef.current = null;
        };
    }, [adminProfile]); // Dependency: hanya re-run jika adminProfile berubah
    // handleIncomingMessage tidak perlu di dependency karena menggunakan functional update

    // ============ SELECT CUSTOMER & FETCH HISTORY ============
    // Effect ini dijalankan setiap kali selectedCustomer berubah
    // Untuk fetch riwayat chat dan mark messages as read
    useEffect(() => {
        // Guard: Jika belum ada customer yang dipilih, skip
        if (!selectedCustomer) return;

        const fetchHistory = async () => {
            try {
                // -------- FETCH CHAT HISTORY --------
                // Ambil semua riwayat pesan dengan customer ini
                const res = await api.get(`/api/chat/history?userId=${selectedCustomer.userId}`);
                const history = res.data.data || res.data;
                // Set ke messages state (pastikan array)
                setMessages(Array.isArray(history) ? history : []);

                // -------- MARK AS READ --------
                // Jika ada unread messages, mark semuanya sebagai sudah dibaca
                if (selectedCustomer.unreadCount > 0) {
                    await api.post(`/api/chat/mark-read?senderId=${selectedCustomer.userId}`);
                    // Update local unread count ke 0 di conversations list
                    setConversations(prev => prev.map(c =>
                        c.userId === selectedCustomer.userId
                            ? { ...c, unreadCount: 0 }
                            : c
                    ));
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();
    }, [selectedCustomer]); // Dependency: re-run ketika customer yang dipilih berubah

    // ============ SEND MESSAGE ============
    /**
     * Function untuk mengirim pesan ke customer
     * Dipanggil saat admin klik tombol Send atau tekan Enter
     */
    const sendMessage = () => {
        // Validasi: pastikan ada pesan, WebSocket connected, dan ada customer yang dipilih
        if (message.trim() && stompClientRef.current && selectedCustomer) {
            // -------- PREPARE PAYLOAD --------
            const payload = {
                receiverId: selectedCustomer.userId, // ID customer penerima
                message: message.trim() // Pesan yang sudah di-trim (hapus spasi)
            };

            // -------- SEND VIA WEBSOCKET --------
            // Publish pesan ke backend via WebSocket STOMP
            // Backend akan broadcast pesan ini ke topic customer dan admin
            stompClientRef.current.publish({
                destination: "/app/chat.send", // Endpoint backend untuk handle send message
                body: JSON.stringify(payload),
            });

            // -------- OPTIMISTIC UI UPDATE --------
            // Update UI langsung tanpa menunggu response dari backend
            // Ini membuat UI lebih responsif dan cepat
            const optimisticMsg = {
                id: Date.now(), // Temporary ID (akan diganti oleh backend saat broadcast balik)
                senderId: adminProfile.id,
                receiverId: selectedCustomer.userId,
                senderRole: "ADMIN",
                message: message.trim(),
                createdAt: new Date().toISOString(),
                isRead: false
            };

            // Tambahkan pesan optimistic ke messages list
            setMessages(prev => [...prev, optimisticMsg]);

            // -------- UPDATE CONVERSATION LAST MESSAGE --------
            // Update last message di sidebar conversations
            setConversations(prev => {
                const idx = prev.findIndex(c => c.userId === selectedCustomer.userId);
                if (idx >= 0) {
                    const newConvs = [...prev];
                    newConvs[idx] = {
                        ...newConvs[idx],
                        lastMessage: message.trim(),
                        lastMessageTime: new Date().toISOString()
                    };
                    // Sort ulang: move conversation ini ke paling atas
                    newConvs.sort((a, b) =>
                        new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
                    );
                    return newConvs;
                }
                return prev;
            });

            // Clear input field
            setMessage("");
        }
    };

    // ============ FILTER CUSTOMERS ============
    // Filter customers berdasarkan search query (nama atau email)
    const filteredCustomers = conversations.filter(c =>
        c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ============ HELPER FUNCTIONS ============
    /**
     * Format timestamp menjadi waktu (HH:MM)
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted time (e.g., "14:30")
     */
    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <AdminLayout title="Chat Pelanggan" activeMenu="chat">
            <div className="h-[calc(100vh-70px)] bg-gray-50 dark:bg-gray-900 transition-colors overflow-hidden">
                <div className="max-w-7xl mx-auto h-full flex flex-col">
                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chat Pelanggan</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Balas pertanyaan pelanggan dengan cepat</p>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Daftar Pelanggan - Sidebar Kiri */}
                        <div className="w-full md:w-96 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
                            {/* Search */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari pelanggan..."
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                                    />
                                </div>
                            </div>

                            {/* List Pelanggan */}
                            <div className="flex-1 overflow-y-auto">
                                {filteredCustomers.map((customer) => (
                                    <button
                                        key={customer.userId}
                                        onClick={() => setSelectedCustomer(customer)}
                                        className={`w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left ${selectedCustomer?.userId === customer.userId ? "bg-amber-50 dark:bg-amber-900/20" : ""
                                            }`}
                                    >
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg">
                                                {customer.userName?.charAt(0).toUpperCase()}
                                            </div>
                                            {customer.isOnline && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {customer.userName}
                                                </p>
                                                {customer.unreadCount > 0 && (
                                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                        {customer.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                {customer.lastMessage || "Belum ada pesan"}
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                                            {formatTime(customer.lastMessageTime)}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chat Window - Kanan */}
                        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
                            {selectedCustomer ? (
                                <>
                                    {/* Header Chat */}
                                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                                                    {selectedCustomer.userName?.charAt(0).toUpperCase()}
                                                </div>
                                                {selectedCustomer.isOnline && (
                                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {selectedCustomer.userName}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    {selectedCustomer.isOnline ? "Online" : "Offline"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                                <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                                <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                        {messages.map((msg, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex ${msg.senderRole === "ADMIN" ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${msg.senderRole === "ADMIN"
                                                        ? "bg-amber-500 text-white rounded-br-none"
                                                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-none"
                                                        }`}
                                                >
                                                    <p className="text-sm">{msg.message}</p>
                                                    <p className={`text-xs mt-1 ${msg.senderRole === "ADMIN" ? "text-amber-100" : "text-gray-500 dark:text-gray-500"}`}>
                                                        {formatTime(msg.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                                <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            </button>
                                            <input
                                                type="text"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                                placeholder="Ketik pesan..."
                                                className="flex-1 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                                            />
                                            <button
                                                onClick={sendMessage}
                                                className="p-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition"
                                            >
                                                <Send className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* Placeholder ketika belum pilih pelanggan */
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-6 flex items-center justify-center">
                                            <MessageCircle className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                                        </div>
                                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                            Pilih pelanggan untuk memulai chat
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                            Semua percakapan akan muncul di sini
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}