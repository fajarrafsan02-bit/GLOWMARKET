import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/Axios.jsx";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function useHeaderData(isLoggedIn, userId) {
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [chatUnreadCount, setChatUnreadCount] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const stompClientRef = useRef(null);
    const notificationRef = useRef(null);

    const fetchCartCount = useCallback(async () => {
        if (!isLoggedIn) {
            setCartCount(0);
            return;
        }
        try {
            const res = await api.get("/api/keranjang");
            const arr = Array.isArray(res.data?.data) ? res.data.data : [];
            const uniqueCount = (() => {
                const ids = new Set();
                let noIdCount = 0;
                arr.forEach((i) => {
                    const id = i.produkId ?? i.produk?.id ?? i.id;
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

    const fetchWishlistCount = useCallback(async () => {
        if (!isLoggedIn) {
            setWishlistCount(0);
            return;
        }
        try {
            const res = await api.get("/api/wishlist");
            const arr = Array.isArray(res.data?.data) ? res.data.data : [];
            setWishlistCount(arr.length);
        } catch {
            setWishlistCount(0);
        }
    }, [isLoggedIn]);

    const fetchChatUnreadCount = useCallback(async () => {
        if (!isLoggedIn) {
            setChatUnreadCount(0);
            return;
        }
        try {
            const res = await api.get("/api/chat/unread-count");
            let count = 0;
            if (res.data?.data?.unreadCount !== undefined) {
                count = res.data.data.unreadCount;
            } else if (res.data?.data !== undefined && typeof res.data.data === "number") {
                count = res.data.data;
            } else if (res.data?.count !== undefined) {
                count = res.data.count;
            }
            setChatUnreadCount(count);
        } catch (err) {
            console.error("[Header] Error fetching unread count:", err);
            setChatUnreadCount(0);
        }
    }, [isLoggedIn]);

    const fetchNotifications = useCallback(async () => {
        if (!isLoggedIn) {
            setNotificationCount(0);
            setNotifications([]);
            return;
        }
        try {
            const res = await api.get("/api/user/notifications");
            const notifData = res.data?.data || [];
            const unreadCount = res.data?.unreadCount || 0;
            setNotifications(notifData);
            setNotificationCount(unreadCount);
        } catch (err) {
            console.error("[Header] Error fetching notifications:", err);
            setNotificationCount(0);
            setNotifications([]);
        }
    }, [isLoggedIn]);

    const markNotificationAsRead = async (notificationId) => {
        try {
            await api.put(`/api/user/notifications/${notificationId}/read`, {});
            await fetchNotifications();
        } catch (err) {
            console.error("[Header] Error marking notification as read:", err);
        }
    };

    const markAllNotificationsAsRead = async () => {
        try {
            await api.put("/api/user/notifications/mark-all-read", {});
            await fetchNotifications();
        } catch (err) {
            console.error("[Header] Error marking all notifications as read:", err);
        }
    };

    useEffect(() => {
        const onStorage = () => {
            setCartCount((prev) => prev);
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    useEffect(() => {
        fetchCartCount();
    }, [fetchCartCount]);

    useEffect(() => {
        fetchWishlistCount();
    }, [fetchWishlistCount]);

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

    useEffect(() => {
        fetchChatUnreadCount();
    }, [fetchChatUnreadCount]);

    // WebSocket untuk update chat dan notifikasi secara real-time
    useEffect(() => {
        if (!isLoggedIn || !userId) {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
            return;
        }

        if (stompClientRef.current && stompClientRef.current.connected) {
            return;
        }

        // Cookie httpOnly ikut terkirim otomatis pada handshake SockJS
        // (sama-origin lewat proxy Vite di dev) — tidak perlu connectHeaders lagi.
        const socketUrl = "/ws";
        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            onConnect: () => {
                client.subscribe(`/topic/chat/customer/${userId}`, (message) => {
                    try {
                        const msg = JSON.parse(message.body);
                        if (msg.senderRole === "ADMIN" && !msg.isRead) {
                            setTimeout(() => {
                                setChatUnreadCount((prev) => prev + 1);
                            }, 0);

                            if (Notification.permission === "granted") {
                                new Notification("Pesan Baru dari Admin", {
                                    body: msg.message.substring(0, 100),
                                    icon: "/favicon.ico",
                                    badge: "/favicon.ico",
                                });
                            }
                        }
                    } catch (e) {
                        console.error("[Header] Error parsing chat message:", e);
                    }
                });

                client.subscribe(`/topic/notifications/user/${userId}`, (message) => {
                    try {
                        const notification = JSON.parse(message.body);
                        setTimeout(() => {
                            setNotificationCount((prev) => prev + 1);
                            fetchNotifications();
                        }, 0);

                        if (Notification.permission === "granted") {
                            new Notification(notification.title || "Notifikasi Baru", {
                                body: notification.message || "",
                                icon: "/favicon.ico",
                                badge: "/favicon.ico",
                            });
                        }
                    } catch (e) {
                        console.error("[Header] Error parsing notification:", e);
                    }
                });
            },
            onStompError: (frame) => {
                console.error("[Header] WebSocket STOMP error:", frame.headers["message"]);
            },
            onWebSocketError: (event) => {
                console.error("[Header] WebSocket connection error:", event);
            },
            onDisconnect: () => {
                // Header di-mount ulang tiap pindah halaman, jadi disconnect
                // adalah hal normal — cukup log level debug.
                console.debug("[Header] WebSocket disconnected");
            },
        });

        client.activate();
        stompClientRef.current = client;

        if (Notification.permission === "default") {
            Notification.requestPermission();
        }

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        };
    }, [isLoggedIn, userId, fetchNotifications]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        if (!isLoggedIn) return;

        const interval = setInterval(() => {
            fetchChatUnreadCount();
            fetchNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, [isLoggedIn, fetchChatUnreadCount, fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showNotifications]);

    return {
        cartCount,
        wishlistCount,
        chatUnreadCount,
        notificationCount,
        notifications,
        showNotifications,
        setShowNotifications,
        notificationRef,
        fetchCartCount,
        fetchWishlistCount,
        fetchNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
    };
}
