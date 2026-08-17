import { useEffect, useState, useRef, useCallback } from "react";
import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Client } from "@stomp/stompjs";
import buatSockJS from "../utils/socketFactory.js";

export default function useUserChat({ defaultMessage, chatContext: incomingContext } = {}) {
    const { isAuthenticated } = useAuth();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [chatContext, setChatContext] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adminId, setAdminId] = useState(null);

    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Handle default message / context from navigation (one-time use)
    useEffect(() => {
        let shouldClear = false;

        if (defaultMessage) {
            setMessage(defaultMessage);
            shouldClear = true;
        }

        if (incomingContext) {
            setChatContext(incomingContext);
            shouldClear = true;
        }

        if (shouldClear) {
            window.history.replaceState({}, document.title);
        }
    }, [defaultMessage, incomingContext]);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fetch Initial Data (Profile & Admin Config)
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }

            try {
                // 1. Get User Profile
                const profileRes = await api.get("/api/user/profile");
                const profile = profileRes.data.data || profileRes.data;
                console.log("[UserChat] User Profile loaded:", profile);
                setUserProfile(profile);

                // 2. Determine Admin ID
                try {
                    // Strategy A: Fetch from Admin List API
                    const adminRes = await api.get("/api/admin/list");
                    const admins = adminRes.data.data || adminRes.data || [];

                    if (Array.isArray(admins) && admins.length > 0) {
                        const defaultAdmin = admins[0];
                        setAdminId(defaultAdmin.id);
                        console.log("[UserChat] Default admin set from API:", defaultAdmin.id);
                    } else {
                        throw new Error("No admins returned from API");
                    }
                } catch (adminErr) {
                    console.warn(
                        "[UserChat] Failed to fetch admin list, trying fallback strategies:",
                        adminErr,
                    );

                    // Strategy B: Detect from Chat History
                    try {
                        const historyRes = await api.get(`/api/chat/history`);
                        const history = historyRes.data.data || historyRes.data || [];

                        if (Array.isArray(history) && history.length > 0) {
                            const adminMsg = history.find((m) => m.senderRole === "ADMIN");
                            if (adminMsg?.senderId) {
                                setAdminId(adminMsg.senderId);
                                console.log(
                                    "[UserChat] Admin ID detected from history:",
                                    adminMsg.senderId,
                                );
                                return; // Exit if found
                            }
                        }
                    } catch (histErr) {
                        console.error("[UserChat] Error fetching history for detection:", histErr);
                        // Continue to final fallback
                    }

                    // Strategy C: Hardcoded Fallback
                    console.log("[UserChat] Using hardcoded fallback admin ID: 1");
                    setAdminId(1);
                }
            } catch (err) {
                console.error("[UserChat] Critical error during initialization:", err);
                setError("Gagal memuat profil. Silakan login ulang.");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [isAuthenticated]);

    // Fetch Chat History when dependencies are ready
    useEffect(() => {
        if (!adminId || !userProfile) return;

        const fetchChatHistory = async () => {
            try {
                const historyRes = await api.get(`/api/chat/history?adminId=${adminId}`);
                const history = historyRes.data.data || historyRes.data;
                setMessages(Array.isArray(history) ? history : []);

                // Mark unread messages from Admin as read
                const hasUnread =
                    Array.isArray(history) &&
                    history.some((m) => m.senderId === adminId && !m.isRead);
                if (hasUnread) {
                    try {
                        await api.post(`/api/chat/mark-read?senderId=${adminId}`, {});
                        window.dispatchEvent(new Event("chat:read"));
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
            console.log("[UserChat] Skipping WebSocket - missing userProfile or adminId");
            return;
        }

        if (!isAuthenticated) {
            console.log("[UserChat] Skipping WebSocket - not authenticated");
            return;
        }

        console.log("[UserChat] Initializing WebSocket for user:", userProfile.id);

        // Prevent duplicate connections
        if (stompClientRef.current && stompClientRef.current.connected) {
            console.log("[UserChat] WebSocket already connected, skipping");
            return;
        }

        // Cookie httpOnly ikut terkirim otomatis pada handshake SockJS.

        const client = new Client({
            webSocketFactory: buatSockJS,
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
                        if (
                            receivedMsg.senderId === adminId &&
                            receivedMsg.senderRole === "ADMIN"
                        ) {
                            try {
                                await api.post(`/api/chat/mark-read?senderId=${adminId}`, {});
                                window.dispatchEvent(new Event("chat:read"));
                            } catch (err) {
                                console.error(
                                    "[UserChat] Failed to mark incoming message as read:",
                                    err,
                                );
                            }
                        }

                        setMessages((prev) => {
                            // Deduplication logic
                            const exists = prev.some(
                                (m) =>
                                    m.id === receivedMsg.id ||
                                    (m.message === receivedMsg.message &&
                                        Math.abs(
                                            new Date(m.createdAt) - new Date(receivedMsg.createdAt),
                                        ) < 1000),
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
            },
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
    }, [userProfile, adminId, isAuthenticated]);

    // Send Message
    const sendMessage = useCallback(async () => {
        if (!message.trim() || !userProfile || !adminId) {
            if (!adminId) {
                setError("Tidak ada admin yang tersedia.");
                setTimeout(() => setError(""), 3000);
            }
            return;
        }

        const payload = {
            receiverId: adminId,
            message: message.trim(),
        };

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
            isRead: false,
        };
        setMessages((prev) => [...prev, optimisticMsg]);

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
                    await api.post("/api/chat/send", payload);
                }
            } else {
                // Fallback to REST API
                await api.post("/api/chat/send", payload);
            }
        } catch (err) {
            console.error("[UserChat] Failed to send message:", err);
            setError("Gagal mengirim pesan. Cek koneksi internet.");
            setTimeout(() => setError(""), 3000);
        }
    }, [message, userProfile, adminId, isConnected]);

    return {
        messages,
        message,
        setMessage,
        chatContext,
        userProfile,
        isConnected,
        loading,
        error,
        sendMessage,
        messagesEndRef,
    };
}
