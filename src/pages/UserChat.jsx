import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import api from "../api/Axios.jsx";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { Send, Paperclip, User, MessageCircle, AlertCircle } from "lucide-react";

export default function UserChat() {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [userProfile, setUserProfile] = useState(null);
    const [showAuth, setShowAuth] = useState(false);

    // Connection & Loading States
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adminId, setAdminId] = useState(null);

    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Handle default message from navigation (one-time use)
    useEffect(() => {
        if (location.state?.defaultMessage) {
            setMessage(location.state.defaultMessage);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fetch Initial Data (Profile & Admin Config)
    useEffect(() => {
        const fetchInitialData = async () => {
            const token = localStorage.getItem("user_token");
            if (!token) {
                setLoading(false);
                setShowAuth(true);
                return;
            }

            try {
                // 1. Get User Profile
                const profileRes = await api.get("/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const profile = profileRes.data.data || profileRes.data;
                console.log('[UserChat] User Profile loaded:', profile);
                setUserProfile(profile);

                // 2. Determine Admin ID
                try {
                    // Strategy A: Fetch from Admin List API
                    const adminRes = await api.get("/api/admin/list");
                    const admins = adminRes.data.data || adminRes.data || [];

                    if (Array.isArray(admins) && admins.length > 0) {
                        const defaultAdmin = admins[0];
                        setAdminId(defaultAdmin.id);
                        console.log('[UserChat] Default admin set from API:', defaultAdmin.id);
                    } else {
                        throw new Error("No admins returned from API");
                    }
                } catch (adminErr) {
                    console.warn('[UserChat] Failed to fetch admin list, trying fallback strategies:', adminErr);

                    // Strategy B: Detect from Chat History
                    try {
                        const historyRes = await api.get(`/api/chat/history`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const history = historyRes.data.data || historyRes.data || [];

                        if (Array.isArray(history) && history.length > 0) {
                            const adminMsg = history.find(m => m.senderRole === 'ADMIN');
                            if (adminMsg?.senderId) {
                                setAdminId(adminMsg.senderId);
                                console.log('[UserChat] Admin ID detected from history:', adminMsg.senderId);
                                return; // Exit if found
                            }
                        }
                    } catch (histErr) {
                        console.error('[UserChat] Error fetching history for detection:', histErr);
                        // Continue to final fallback
                    }

                    // Strategy C: Hardcoded Fallback
                    console.log('[UserChat] Using hardcoded fallback admin ID: 1');
                    setAdminId(1);
                }

            } catch (err) {
                console.error("[UserChat] Critical error during initialization:", err);
                setError("Gagal memuat profil. Silakan login ulang.");

                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem("user_token");
                    localStorage.removeItem("user_email");
                    localStorage.removeItem("user_name");
                    setShowAuth(true);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Fetch Chat History when dependencies are ready
    useEffect(() => {
        if (!adminId || !userProfile) return;

        const fetchChatHistory = async () => {
            const token = localStorage.getItem("user_token");
            if (!token) return;

            try {
                const historyRes = await api.get(`/api/chat/history?adminId=${adminId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const history = historyRes.data.data || historyRes.data;
                setMessages(Array.isArray(history) ? history : []);

                // Mark unread messages from Admin as read
                const hasUnread = Array.isArray(history) && history.some(m => m.senderId === adminId && !m.isRead);
                if (hasUnread) {
                    try {
                        await api.post(`/api/chat/mark-read?senderId=${adminId}`, {}, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        window.dispatchEvent(new Event('chat:read'));
                    } catch (readErr) {
                        console.error("[UserChat] Failed to mark history as read:", readErr);
                    }
                }
            } catch (histErr) {
                console.error("[UserChat] Error fetching chat history:", histErr);
                setMessages([]); // Start fresh on error
            }
        };

        fetchChatHistory();
    }, [adminId, userProfile]);

    // WebSocket Connection
    useEffect(() => {
        if (!userProfile || !adminId) {
            console.log('[UserChat] Skipping WebSocket - missing userProfile or adminId');
            return;
        }

        const token = localStorage.getItem("user_token");
        if (!token) {
            console.log('[UserChat] Skipping WebSocket - no token');
            return;
        }

        console.log('[UserChat] Initializing WebSocket for user:', userProfile.id);

        // Prevent duplicate connections
        if (stompClientRef.current && stompClientRef.current.connected) {
            console.log('[UserChat] WebSocket already connected, skipping');
            return;
        }

        const socketUrl = "http://localhost:8080/ws";

        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            onConnect: () => {
                console.log("[UserChat] WebSocket Connected");
                setIsConnected(true);

                const handleMessage = async (message) => {
                    try {
                        const receivedMsg = JSON.parse(message.body);
                        console.log("[UserChat] Message received:", receivedMsg);

                        // Mark as read if from current admin
                        if (receivedMsg.senderId === adminId && receivedMsg.senderRole === 'ADMIN') {
                            try {
                                await api.post(`/api/chat/mark-read?senderId=${adminId}`, {}, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                window.dispatchEvent(new Event('chat:read'));
                            } catch (err) {
                                console.error("[UserChat] Failed to mark incoming message as read:", err);
                            }
                        }

                        setMessages((prev) => {
                            // Deduplication logic
                            const exists = prev.some(m =>
                                m.id === receivedMsg.id ||
                                (m.message === receivedMsg.message &&
                                    Math.abs(new Date(m.createdAt) - new Date(receivedMsg.createdAt)) < 1000)
                            );
                            return exists ? prev : [...prev, receivedMsg];
                        });
                    } catch (parseErr) {
                        console.error("[UserChat] Error processing incoming message:", parseErr);
                    }
                };

                // Subscribe to both topics for compatibility
                client.subscribe(`/topic/chat/customer/${userProfile.id}`, handleMessage);
                client.subscribe(`/topic/chat/user/${userProfile.id}`, handleMessage);
            },
            onStompError: (frame) => {
                console.error("[UserChat] STOMP error:", frame.headers["message"]);
                console.error("[UserChat] Frame body:", frame.body);
                setIsConnected(false);
            },
            onWebSocketError: (event) => {
                console.error("[UserChat] WebSocket error:", event);
                setIsConnected(false);
            },
            onDisconnect: () => {
                console.log("[UserChat] Disconnected");
                setIsConnected(false);
            }
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            console.log("[UserChat] Cleaning up WebSocket");
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        };
    }, [userProfile, adminId]);

    // Send Message
    const sendMessage = async () => {
        if (!message.trim() || !userProfile || !adminId) {
            if (!adminId) {
                setError("Tidak ada admin yang tersedia.");
                setTimeout(() => setError(""), 3000);
            }
            return;
        }

        const payload = {
            receiverId: adminId,
            message: message.trim()
        };

        const token = localStorage.getItem("user_token");
        const currentMessage = message.trim();
        setMessage(""); // Clear input immediately for better UX

        // Optimistic Update
        const optimisticMsg = {
            id: Date.now(),
            senderId: userProfile.id,
            receiverId: adminId,
            senderRole: "USER",
            message: currentMessage,
            createdAt: new Date().toISOString(),
            isRead: false
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            // Try WebSocket first if connected
            if (stompClientRef.current && isConnected) {
                try {
                    stompClientRef.current.publish({
                        destination: "/app/chat.send",
                        body: JSON.stringify(payload),
                    });
                } catch (wsErr) {
                    console.error("[UserChat] WebSocket send failed, falling back to REST:", wsErr);
                    await api.post("/api/chat/send", payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }
            } else {
                // Fallback to REST API
                await api.post("/api/chat/send", payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (err) {
            console.error("[UserChat] Failed to send message:", err);
            setError("Gagal mengirim pesan. Cek koneksi internet.");
            setTimeout(() => setError(""), 3000);
            // In a real app, we might want to mark the message as "failed" in the UI here
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (!userProfile && !loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header setShowAuth={setShowAuth} />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <MessageCircle className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                        Login untuk Chat
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Silakan login terlebih dahulu untuk menghubungi admin kami.
                    </p>
                    <button
                        onClick={() => setShowAuth(true)}
                        className="px-8 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium transition"
                    >
                        Login Sekarang
                    </button>
                </div>
                <Footer />
                <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Header setShowAuth={setShowAuth} />

            <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 flex flex-col h-[calc(100vh-64px)]">
                {/* Chat Card */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">

                    {/* Header Chat */}
                    <div className="bg-gradient-to-r from-amber-600 to-yellow-600 px-4 py-3 text-white flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="font-bold text-base">Customer Service</h1>
                                <p className="text-[10px] opacity-90 flex items-center gap-1">
                                    {isConnected ? (
                                        <>
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                            Online
                                        </>
                                    ) : (
                                        <>
                                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                                            Connecting...
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                        {error && (
                            <div
                                className="mb-4 p-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-600/50 rounded-xl text-red-700 dark:text-red-300 text-sm flex items-center gap-2 animate-fade-in"
                            >
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        {messages.length === 0 ? (
                            <div className="text-center py-10 opacity-60">
                                <p className="text-gray-500 dark:text-gray-400">Belum ada pesan.</p>
                                <p className="text-sm text-gray-400">Silakan kirim pesan untuk memulai percakapan.</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => {
                                const isMe = msg.senderRole === "USER" || msg.senderId === userProfile.id;

                                return (
                                    <div
                                        key={idx}
                                        className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in-up`}
                                    >
                                        <div className={`max-w-[85%] md:max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                                            <div
                                                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm leading-relaxed shadow-sm ${isMe
                                                    ? "bg-amber-600 text-white rounded-br-none"
                                                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none"
                                                    }`}
                                            >
                                                {msg.image && (
                                                    <img
                                                        src={msg.image}
                                                        alt="Attachment"
                                                        className="max-w-full rounded-lg mb-2"
                                                    />
                                                )}
                                                <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                                            </div>
                                            <span className="text-[10px] text-gray-400 mt-1 px-1">
                                                {formatTime(msg.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition">
                                <Paperclip className="w-4 h-4" />
                            </button>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Tulis pesan..."
                                className="flex-1 px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-amber-500 focus:bg-white dark:focus:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none transition"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!message.trim()}
                                className="p-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md shadow-amber-600/20 transition-all transform active:scale-95"
                                title={!isConnected ? "Menggunakan REST API (WebSocket disconnected)" : "Kirim pesan"}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </div>
    );
}
