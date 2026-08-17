import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    BarChart3,
    Calculator,
    LayoutDashboard,
    MessageCircle,
    Package,
    RotateCcw,
    Settings,
    ShoppingBag,
    TicketPercent,
    Users,
} from "lucide-react";

import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function useAdminSidebar({ setMobileOpen }) {
    const navigate = useNavigate();

    const { isAdmin } = useAuth();

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        let interval;

        const fetchUnreadCount = async () => {
            try {
                if (!isAdmin) {
                    return;
                }

                const response = await api.get("/api/chat/unread-count");

                const count = Number(response.data?.data?.unreadCount) || 0;

                setUnreadCount(count);
            } catch (error) {
                console.error("[AdminSidebar] Failed to load unread count:", error);
            }
        };

        fetchUnreadCount();

        interval = setInterval(fetchUnreadCount, 5000);

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isAdmin]);

    const menuGroups = [
        {
            label: "MENU",
            items: [
                {
                    key: "dashboard",
                    icon: LayoutDashboard,
                    label: "Dashboard",
                    path: "/admin/dashboard",
                },
                {
                    key: "orders",
                    icon: ShoppingBag,
                    label: "Pesanan",
                    path: "/admin/orders",
                },
                {
                    key: "products",
                    icon: Package,
                    label: "Produk",
                    path: "/admin/products",
                },
                {
                    key: "customers",
                    icon: Users,
                    label: "Pelanggan",
                    path: "/admin/pelanggan",
                },
            ],
        },
        {
            label: "ANALYTICS",
            items: [
                {
                    key: "reports",
                    icon: BarChart3,
                    label: "Laporan",
                    path: "/admin/laporan",
                },
                {
                    key: "accounting",
                    icon: Calculator,
                    label: "Akuntansi",
                    path: "/admin/akuntansi",
                },
                {
                    key: "vouchers",
                    icon: TicketPercent,
                    label: "Voucher",
                    path: "/admin/vouchers",
                },
                {
                    key: "returns",
                    icon: RotateCcw,
                    label: "Pengembalian",
                    path: "/admin/pengembalian",
                },
            ],
        },
        {
            label: "SYSTEM",
            items: [
                {
                    key: "settings",
                    icon: Settings,
                    label: "Pengaturan",
                    path: "/admin/settings",
                },
            ],
        },
        {
            label: "CUSTOMER",
            items: [
                {
                    key: "chat",
                    icon: MessageCircle,
                    label: "Chat Pelanggan",
                    path: "/admin/chat",
                    plainIcon: true,
                    badge: unreadCount > 0 ? (unreadCount > 99 ? "99+" : unreadCount) : null,
                },
            ],
        },
    ];

    const handleMenuClick = (item, isMobile = false) => {
        if (item.path) {
            navigate(item.path);

            if (isMobile) {
                setMobileOpen(false);
            }
        }
    };

    return { menuGroups, handleMenuClick };
}
