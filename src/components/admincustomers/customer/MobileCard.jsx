import { Phone } from "lucide-react";

import { formatDate, formatPrice } from "../../../utils/format.js";

import CustomerAvatar from "./CustomerAvatar.jsx";
import CustomerStat from "./CustomerStat.jsx";
import CustomerStatusBadge from "./CustomerStatusBadge.jsx";
import CustomerMenu from "./CustomerMenu.jsx";

export default function MobileCard({
    customerName,
    customerEmail,
    customerPhone,
    totalOrders,
    totalSpent,
    isActive,
    createdAt,
    isMenuOpen,
    onToggleMenu,
    onCloseMenu,
    onView,
    onEdit,
    onDisable,
}) {
    return (
        <div className="lg:hidden p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <CustomerAvatar name={customerName} size="md" />

                    <div className="min-w-0">
                        <p className="text-[11px] sm:text-xs font-semibold text-gray-900 dark:text-white truncate">
                            {customerName}
                        </p>

                        <p className="text-[9px] sm:text-[10px] text-gray-400 truncate">
                            {customerEmail}
                        </p>
                    </div>
                </div>

                <div className="relative shrink-0">
                    <CustomerMenu
                        open={isMenuOpen}
                        onToggle={onToggleMenu}
                        onClose={onCloseMenu}
                        isActive={isActive}
                        onView={onView}
                        onEdit={onEdit}
                        onDisable={onDisable}
                        buttonClass="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    />
                </div>
            </div>

            {/* Contact */}
            {customerPhone && (
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-400">
                    <Phone className="w-3 h-3" />
                    {customerPhone}
                </div>
            )}

            {/* Stats */}
            <div className="mt-2.5 sm:mt-3 grid grid-cols-3 gap-1.5 sm:gap-2">
                <CustomerStat label="Pesanan" value={totalOrders} />

                <CustomerStat label="Belanja" value={formatPrice(totalSpent)} />

                <CustomerStat label="Status" value={isActive ? "Aktif" : "Nonaktif"} />
            </div>

            {/* Date */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">Bergabung {formatDate(createdAt)}</span>

                <CustomerStatusBadge isActive={isActive} />
            </div>
        </div>
    );
}
