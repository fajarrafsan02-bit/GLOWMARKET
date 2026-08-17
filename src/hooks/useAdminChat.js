import { useEffect, useRef, useState } from "react";
import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function useAdminChat() {
    const { isAdmin } = useAuth();
    // ============ STATE MANAGEMENT ============
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // ============ REAL DATA STATES ============
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [adminProfile, setAdminProfile] = useState(null);

    // ============ REFS ============
    const stompClientRef = useRef(null);
    const selectedCustomerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const onlineStatusPollingRef = useRef(null);

    // Sync selectedCustomerRef
    useEffect(() => {
        selectedCustomerRef.current = selectedCustomer;
    }, [selectedCustomer]);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch Initial Data & Setup Polling
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const profileRes = await api.get("/api/user/profile/admin");
                const profile = profileRes.data.data || profileRes.data;
                setAdminProfile(profile);

                const convRes = await api.get("/api/chat/conversations");
                const convData = convRes.data.data || convRes.data;
                const conversations = Array.isArray(convData) ? convData : [];

                try {
                    const onlineRes = await api.get("/api/chat/online-users");
                    const onlineUsers = onlineRes.data.data || [];
                    const onlineUserIds = new Set(onlineUsers.map((u) => u.id));

                    const conversationsWithStatus = conversations.map((conv) => ({
                        ...conv,
                        isOnline: onlineUserIds.has(conv.userId),
                    }));

                    setConversations(conversationsWithStatus);
                } catch (err) {
                    console.error("[AdminChat] Error fetching online users:", err);
                    setConversations(conversations.map((conv) => ({ ...conv, isOnline: false })));
                }
            } catch (error) {
                console.error("[AdminChat] Error fetching initial data:", error);
            }
        };

        fetchInitialData();

        const startOnlineStatusPolling = () => {
            onlineStatusPollingRef.current = setInterval(async () => {
                try {
                    const onlineRes = await api.get("/api/chat/online-users");
                    const onlineUsers = onlineRes.data.data || [];
                    const onlineUserIds = new Set(onlineUsers.map((u) => u.id));

                    setConversations((prev) =>
                        prev.map((conv) => ({
                            ...conv,
                            isOnline: onlineUserIds.has(conv.userId),
                        })),
                    );

                    setSelectedCustomer((prevSelected) => {
                        if (prevSelected) {
                            return {
                                ...prevSelected,
                                isOnline: onlineUserIds.has(prevSelected.userId),
                            };
                        }
                        return prevSelected;
                    });
                } catch (err) {
                    console.error("[AdminChat] Error polling online status:", err);
                }
            }, 15000);
        };

        startOnlineStatusPolling();

        return () => {
            if (onlineStatusPollingRef.current) {
                clearInterval(onlineStatusPollingRef.current);
            }
        };
    }, []);

    // Handle Incoming Message via WebSocket
    const handleIncomingMessage = async (newMsg) => {
        const currentSelected = selectedCustomerRef.current;
        const isFromSelected =
            currentSelected &&
            (newMsg.senderId === currentSelected.userId ||
                newMsg.receiverId === currentSelected.userId);

        if (isFromSelected && newMsg.senderRole === "USER") {
            try {
                await api.post(`/api/chat/mark-read?senderId=${newMsg.senderId}`);
                newMsg.isRead = true;
            } catch (e) {
                console.error("Gagal menandai pesan terbaca:", e);
            }
        }

        setMessages((prev) => {
            if (isFromSelected) {
                const exists = prev.some((m) => m.id === newMsg.id);
                if (exists) return prev;
                return [...prev, newMsg];
            }
            return prev;
        });

        setConversations((prev) => {
            const senderId =
                newMsg.senderId === adminProfile?.id ? newMsg.receiverId : newMsg.senderId;

            const existingConvIndex = prev.findIndex((c) => c.userId === senderId);

            if (existingConvIndex >= 0) {
                const updatedConv = [...prev];
                const conv = updatedConv[existingConvIndex];

                const newUnreadCount =
                    currentSelected?.userId === senderId ? 0 : conv.unreadCount + 1;

                updatedConv[existingConvIndex] = {
                    ...conv,
                    lastMessage: newMsg.message,
                    lastMessageTime: newMsg.createdAt,
                    unreadCount: newUnreadCount,
                };

                updatedConv.sort(
                    (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime),
                );
                return updatedConv;
            } else {
                if (newMsg.senderRole === "USER") {
                    const newConv = {
                        userId: senderId,
                        userName: newMsg.senderName || "Pelanggan Baru",
                        userEmail: newMsg.senderEmail || "",
                        lastMessage: newMsg.message,
                        lastMessageTime: newMsg.createdAt,
                        unreadCount: 1,
                        isOnline: true,
                    };
                    return [newConv, ...prev];
                }
                return prev;
            }
        });
    };

    // WebSocket Connection
    useEffect(() => {
        if (!adminProfile || !isAdmin) return;
        // Cookie httpOnly ikut terkirim otomatis pada handshake SockJS.
        const socketUrl = "/ws";

        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            onConnect: () => {
                console.log("[AdminChat] WebSocket Connected");

                client.subscribe(`/topic/chat/admin/${adminProfile.id}`, (message) => {
                    const receivedMsg = JSON.parse(message.body);
                    handleIncomingMessage(receivedMsg);
                });

                client.subscribe("/topic/user.presence", (message) => {
                    const presenceUpdate = JSON.parse(message.body);

                    setConversations((prev) =>
                        prev.map((conv) => {
                            const isMatch =
                                conv.userId === presenceUpdate.userId ||
                                conv.userEmail === presenceUpdate.email;
                            if (isMatch) {
                                return {
                                    ...conv,
                                    isOnline: presenceUpdate.status === "ONLINE",
                                };
                            }
                            return conv;
                        }),
                    );

                    setSelectedCustomer((prevSelected) => {
                        if (
                            prevSelected &&
                            (prevSelected.userId === presenceUpdate.userId ||
                                prevSelected.userEmail === presenceUpdate.email)
                        ) {
                            return {
                                ...prevSelected,
                                isOnline: presenceUpdate.status === "ONLINE",
                            };
                        }
                        return prevSelected;
                    });
                });
            },
            onStompError: (frame) => {
                console.error("Broker reported error: " + frame.headers["message"]);
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (client) client.deactivate();
            stompClientRef.current = null;
        };
    }, [adminProfile, isAdmin]);

    // Fetch History when Customer Selected
    useEffect(() => {
        if (!selectedCustomer) return;

        const fetchHistory = async () => {
            try {
                const res = await api.get(`/api/chat/history?userId=${selectedCustomer.userId}`);
                const history = res.data.data || res.data;
                setMessages(Array.isArray(history) ? history : []);

                if (selectedCustomer.unreadCount > 0) {
                    await api.post(`/api/chat/mark-read?senderId=${selectedCustomer.userId}`);
                    setConversations((prev) =>
                        prev.map((c) =>
                            c.userId === selectedCustomer.userId ? { ...c, unreadCount: 0 } : c,
                        ),
                    );
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();
    }, [selectedCustomer]);

    // Send Message
    const sendMessage = () => {
        if (message.trim() && stompClientRef.current && selectedCustomer) {
            const payload = {
                receiverId: selectedCustomer.userId,
                message: message.trim(),
            };

            stompClientRef.current.publish({
                destination: "/app/chat.send",
                body: JSON.stringify(payload),
            });

            const optimisticMsg = {
                id: Date.now(),
                senderId: adminProfile.id,
                receiverId: selectedCustomer.userId,
                senderRole: "ADMIN",
                message: message.trim(),
                createdAt: new Date().toISOString(),
                isRead: false,
            };

            setMessages((prev) => [...prev, optimisticMsg]);

            setConversations((prev) => {
                const idx = prev.findIndex((c) => c.userId === selectedCustomer.userId);
                if (idx >= 0) {
                    const newConvs = [...prev];
                    newConvs[idx] = {
                        ...newConvs[idx],
                        lastMessage: message.trim(),
                        lastMessageTime: new Date().toISOString(),
                    };
                    newConvs.sort(
                        (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime),
                    );
                    return newConvs;
                }
                return prev;
            });

            setMessage("");
        }
    };

    const filteredCustomers = conversations.filter(
        (c) =>
            c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.userEmail.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return {
        selectedCustomer,
        setSelectedCustomer,
        message,
        setMessage,
        searchQuery,
        setSearchQuery,
        messages,
        filteredCustomers,
        formatTime,
        messagesEndRef,
        sendMessage,
    };
}
