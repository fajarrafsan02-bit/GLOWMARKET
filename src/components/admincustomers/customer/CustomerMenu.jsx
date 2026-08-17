import { MoreVertical } from "lucide-react";

import CustomerActionMenu from "./CustomerActionMenu.jsx";

export default function CustomerMenu({
    open,
    onToggle,
    onClose,
    isActive,
    onView,
    onEdit,
    onDisable,
    buttonClass,
}) {
    return (
        <div className="relative">
            <button
                type="button"
                onClick={onToggle}
                className={buttonClass}
                aria-label="Aksi pelanggan"
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            <CustomerActionMenu
                open={open}
                onClose={onClose}
                isActive={isActive}
                onView={onView}
                onEdit={onEdit}
                onDisable={onDisable}
            />
        </div>
    );
}
