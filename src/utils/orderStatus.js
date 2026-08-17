import { CheckCircle2, Clock3, Package, Truck, RotateCcw } from "lucide-react";

export const ORDER_STATUSES = ["PENDING", "DIKEMAS", "DIKIRIM", "SELESAI", "DIBATALKAN", "DIKEMBALIKAN"];

export function orderStatusLabel(status) {
    switch (status) {
        case "PENDING":
            return "Menunggu Bayar";
        case "DIKEMAS":
            return "Dikemas";
        case "DIKIRIM":
            return "Dikirim";
        case "SELESAI":
            return "Selesai";
        case "DIBATALKAN":
            return "Dibatalkan";
        case "DIKEMBALIKAN":
            return "Dikembalikan";
        default:
            return status || "Menunggu Bayar";
    }
}

export function getOrderStatusMeta(status) {
    const value = String(status || "").toUpperCase();

    if (["PENDING", "UNPAID", "DIBUAT", "CREATED"].includes(value)) {
        return {
            icon: Clock3,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-900/20",
        };
    }

    if (["PAID", "SETTLED", "PROCESSING", "DIKEMAS", "DIPROSES", "PACKED"].includes(value)) {
        return {
            icon: Package,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
        };
    }

    if (["SHIPPED", "DIKIRIM"].includes(value)) {
        return {
            icon: Truck,
            color: "text-indigo-600 dark:text-indigo-400",
            bg: "bg-indigo-50 dark:bg-indigo-900/20",
        };
    }

    if (["COMPLETED", "DELIVERED", "SELESAI"].includes(value)) {
        return {
            icon: CheckCircle2,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
        };
    }

    if (["DIKEMBALIKAN", "PENGEMBALIAN", "RETURNED", "REFUNDED"].includes(value)) {
        return {
            icon: RotateCcw,
            color: "text-rose-600 dark:text-rose-400",
            bg: "bg-rose-50 dark:bg-rose-900/20",
        };
    }

    return {
        icon: Package,
        color: "text-gray-500 dark:text-gray-400",
        bg: "bg-gray-100 dark:bg-gray-800",
    };
}
