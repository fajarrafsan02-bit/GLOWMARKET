import { Package, User, Eye, ChevronRight } from "lucide-react";

import { formatPrice } from "../../utils/format.js";
import { orderStatusLabel } from "../../utils/orderStatus.js";

function formatDate(dateValue) {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getStatusStyle(status) {
    const value = String(status || "").toUpperCase();

    if (["PENDING", "UNPAID", "DIBUAT", "CREATED"].includes(value)) {
        return {
            dot: "bg-amber-500",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            text: "text-amber-700 dark:text-amber-400",
        };
    }

    if (["PAID", "SETTLED", "PROCESSING", "DIKEMAS", "DIPROSES", "PACKED"].includes(value)) {
        return {
            dot: "bg-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            text: "text-blue-700 dark:text-blue-400",
        };
    }

    if (["SHIPPED", "DIKIRIM"].includes(value)) {
        return {
            dot: "bg-indigo-500",
            bg: "bg-indigo-50 dark:bg-indigo-900/20",
            text: "text-indigo-700 dark:text-indigo-400",
        };
    }

    if (["COMPLETED", "DELIVERED", "SELESAI"].includes(value)) {
        return {
            dot: "bg-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            text: "text-emerald-700 dark:text-emerald-400",
        };
    }

    return {
        dot: "bg-gray-400",
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-600 dark:text-gray-400",
    };
}

export default function OrderCard({ order, onDetail }) {
    const statusStyle = getStatusStyle(order.status);

    const orderNumber = order.nomorPesanan || `ORD-${order.id}`;

    const customer = order.userName || order.customerName || order.email || "Guest";

    const total = order.totalHarga ?? order.total ?? 0;

    const itemCount = Array.isArray(order.items)
        ? order.items.reduce((sum, item) => sum + Number(item.quantity ?? item.jumlah ?? 1), 0)
        : null;

    return (
        <div className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-colors hover:border-gray-300 dark:hover:border-gray-700">
            {/* =================================================
                DESKTOP
            ================================================== */}

            <div className="hidden md:grid grid-cols-[1.4fr_1.6fr_1fr_1fr_100px] items-center gap-4 px-5 py-4">
                {/* Order */}
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                                {orderNumber}
                            </p>

                            <p className="mt-0.5 text-[10px] text-gray-400">
                                {formatDate(order.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Customer */}
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 shrink-0 text-gray-400" />

                        <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                                {customer}
                            </p>

                            {order.email && (
                                <p className="mt-0.5 text-[10px] text-gray-400 truncate">
                                    {order.email}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Total */}
                <div>
                    <p className="md:hidden text-[9px] uppercase tracking-wider text-gray-400">
                        Total
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {formatPrice(total)}
                    </p>

                    {itemCount !== null && (
                        <p className="mt-0.5 text-[10px] text-gray-400">{itemCount} item</p>
                    )}
                </div>

                {/* Status */}
                <div>
                    <span
                        className={` inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-medium ${statusStyle.bg} ${statusStyle.text} `}
                    >
                        <span className={` w-1.5 h-1.5 rounded-full ${statusStyle.dot} `} />

                        {orderStatusLabel(order.status)}
                    </span>
                </div>

                {/* Action */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => onDetail(order)}
                        className="h-8 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-600 dark:hover:text-amber-400 transition inline-flex items-center gap-1.5"
                    >
                        Detail
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* =================================================
                MOBILE
            ================================================== */}

            <div className="md:hidden p-3 sm:p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[11px] sm:text-xs font-semibold text-gray-900 dark:text-white truncate">
                                    {orderNumber}
                                </p>

                                <p className="mt-0.5 text-[9px] sm:text-[10px] text-gray-400">
                                    {formatDate(order.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <span
                        className={` shrink-0 inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-medium ${statusStyle.bg} ${statusStyle.text} `}
                    >
                        <span className={` w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${statusStyle.dot} `} />

                        {orderStatusLabel(order.status)}
                    </span>
                </div>

                {/* Customer + Total */}
                <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 min-w-0">
                        <p className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 truncate">
                            Pelanggan
                        </p>

                        <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5 min-w-0">
                            <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />

                            <p className="text-[10px] sm:text-[11px] font-medium text-gray-800 dark:text-gray-200 truncate">
                                {customer}
                            </p>
                        </div>
                    </div>

                    <div className="p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 min-w-0">
                        <p className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 truncate">Total</p>

                        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white break-all">
                            {formatPrice(total)}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2 sm:gap-3">
                    {itemCount !== null ? (
                        <p className="text-[9px] sm:text-[10px] text-gray-400">{itemCount} item</p>
                    ) : (
                        <span />
                    )}

                    <button
                        type="button"
                        onClick={() => onDetail(order)}
                        className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] sm:text-[11px] font-semibold inline-flex items-center gap-1 sm:gap-1.5 transition"
                    >
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Lihat Detail
                    </button>
                </div>
            </div>
        </div>
    );
}
