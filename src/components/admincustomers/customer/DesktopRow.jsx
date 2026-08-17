import { Mail, Phone, ShoppingBag } from "lucide-react";

import { formatDateTime, formatPrice } from "../../../utils/format.js";

import CustomerAvatar from "./CustomerAvatar.jsx";
import CustomerStatusBadge from "./CustomerStatusBadge.jsx";
import CustomerMenu from "./CustomerMenu.jsx";

export default function DesktopRow({
    customerName,
    customerId,
    customerEmail,
    customerPhone,
    totalOrders,
    totalSpent,
    isActive,
    lastLogin,
    isMenuOpen,
    onToggleMenu,
    onCloseMenu,
    onView,
    onEdit,
    onDisable,
}) {
    return (
        <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_40px] items-center gap-4 px-4 py-3.5">
            {/* Customer */}
            <div className="min-w-0">
                <div className="flex items-center gap-3">
                    <CustomerAvatar name={customerName} size="sm" />

                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                            {customerName}
                        </p>

                        <p className="mt-0.5 text-[10px] text-gray-400 truncate">
                            ID #{customerId}
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact */}
            <div className="min-w-0">
                <div className="space-y-1 text-[10px] text-gray-500 dark:text-gray-400">
                    {customerEmail !== "-" && (
                        <div className="flex items-center gap-1.5 min-w-0">
                            <Mail className="w-3 h-3 shrink-0 text-gray-400" />
                            <span className="truncate">{customerEmail}</span>
                        </div>
                    )}

                    {customerPhone && (
                        <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 shrink-0 text-gray-400" />
                            <span>{customerPhone}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Orders */}
            <div>
                <p className="text-[9px] uppercase tracking-wider text-gray-400">Pesanan</p>

                <div className="mt-1 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />

                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {totalOrders}
                    </span>
                </div>
            </div>

            {/* Total Spent */}
            <div>
                <p className="text-[9px] uppercase tracking-wider text-gray-400">Total Belanja</p>

                <p className="mt-1 text-xs font-semibold text-gray-900 dark:text-white">
                    {formatPrice(totalSpent)}
                </p>
            </div>

            {/* Status */}
            <div>
                <CustomerStatusBadge isActive={isActive} compact />

                <p className="mt-1 text-[9px] text-gray-400">{formatDateTime(lastLogin)}</p>
            </div>

            {/* Menu */}
            <div className="relative flex justify-end">
                <CustomerMenu
                    open={isMenuOpen}
                    onToggle={onToggleMenu}
                    onClose={onCloseMenu}
                    isActive={isActive}
                    onView={onView}
                    onEdit={onEdit}
                    onDisable={onDisable}
                    buttonClass="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                />
            </div>
        </div>
    );
}
