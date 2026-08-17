import { X } from "lucide-react";

export default function SidebarBrand({ storeName, mobile, onNavigate, onClose }) {
    return (
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <button
                type="button"
                onClick={onNavigate}
                className="flex items-center gap-2.5 min-w-0"
            >
                <div className="w-9 h-9 shrink-0 rounded-lg overflow-hidden bg-[#FFF9F1] border border-amber-200/80">
                    <img
                        src="/logo-mark.png"
                        alt={storeName}
                        className="w-full h-full object-contain"
                    />
                </div>

                <div className="text-left min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {storeName}
                    </p>

                    <p className="text-[10px] text-gray-400">Admin Panel</p>
                </div>
            </button>

            {mobile && (
                <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    aria-label="Tutup menu"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
