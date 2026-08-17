import { X } from "lucide-react";

export default function CustomerDetailHeader({ customer, isActive, onClose }) {
    const name = customer.nama || customer.name || "Pelanggan Tanpa Nama";

    return (
        <div className="shrink-0 px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-700 dark:text-amber-400 text-sm sm:text-base font-semibold">
                    {name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h2 className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {name}
                        </h2>

                        <span
                            className={` inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-medium ${isActive ? ` bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ` : ` bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 `} `}
                        >
                            <span
                                className={` w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"} `}
                            />

                            {isActive ? "Aktif" : "Nonaktif"}
                        </span>
                    </div>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                        ID #{customer.id || customer.userId || "-"}
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Tutup"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
