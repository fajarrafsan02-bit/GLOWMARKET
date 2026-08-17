import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useWebSocket } from "../hooks/useWebSocket";

export default function useAdminNotifications() {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    const [notifCount, setNotifCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showNotifList, setShowNotifList] = useState(false);

    const refetchNotifications = useCallback(async () => {
        try {
            if (!isAdmin) return;

            const response = await api.get("/api/admin/notifications");

            if (response.data.success) {
                const notifs = response.data.data || [];
                setNotifications(notifs);
                setNotifCount(response.data.unreadCount || 0);
            }
        } catch (error) {
            console.error("Gagal mengambil notifikasi:", error);
        }
    }, [isAdmin]);

    const handleNewNotification = useCallback((notification) => {
        setNotifications((prev) => [notification, ...prev].slice(0, 50));

        if (!notification.isRead) {
            setNotifCount((prev) => prev + 1);
        }
    }, []);

    const { isConnected } = useWebSocket(
        "/topic/admin/notifications",
        handleNewNotification,
    );

    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                if (!isAdmin) return;

                try {
                    await api.get("/api/admin/notifications/check-low-stock");
                } catch (e) {
                    console.warn("Gagal pengecekan stok rendah", e);
                }

                const response = await api.get("/api/admin/notifications");

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
    }, [isAdmin]);

    const markAllAsRead = async () => {
        try {
            if (!isAdmin) return;

            await api.put("/api/admin/notifications/mark-all-read", {});

            setTimeout(() => refetchNotifications(), 0);
        } catch (error) {
            console.error("Gagal menandai semua dibaca:", error);
        }
    };

    const navigateToNotification = (notif) => {
        if (notif.type === "NEW_ORDER") {
            navigate("/admin/orders");
        } else if (notif.type === "NEW_CUSTOMER") {
            navigate("/admin/pelanggan");
        } else if (notif.type === "LOW_STOCK") {
            navigate("/admin/products");
        }
        setShowNotifList(false);
    };

    const markAsRead = async (notif) => {
        if (notif.isRead) {
            navigateToNotification(notif);
            return;
        }

        try {
            if (!isAdmin) return;

            await api.put(`/api/admin/notifications/${notif.id}/read`, {});

            setTimeout(() => refetchNotifications(), 0);

            navigateToNotification(notif);
        } catch (error) {
            console.error("Gagal menandai dibaca:", error);
            navigateToNotification(notif);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Baru saja";
        if (minutes < 60) return `${minutes} menit lalu`;
        if (hours < 24) return `${hours} jam lalu`;
        return `${days} hari lalu`;
    };

    return {
        notifications,
        notifCount,
        showNotifList,
        setShowNotifList,
        markAllAsRead,
        markAsRead,
        formatTime,
        isConnected,
    };
}
