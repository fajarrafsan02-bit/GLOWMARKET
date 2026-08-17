import { X } from "lucide-react";

export default function OrderStatusHeader({ order, onClose }) {
    return (
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 shrink-0">
            <div className="min-w-0">
                <h3 className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                    Update Status Pesanan
                </h3>

                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-gray-400 truncate">
                    {order.nomorPesanan || `ORD-${order.id}`}
                </p>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
