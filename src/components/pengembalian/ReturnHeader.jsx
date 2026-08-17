import { RotateCcw } from "lucide-react";

export default function ReturnHeader({ onToggleForm }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                    Pengembalian Barang
                </h1>

                <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Ajukan retur untuk pesanan yang sudah selesai
                </p>
            </div>

            <button
                type="button"
                onClick={onToggleForm}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] sm:text-sm font-semibold transition shrink-0"
            >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Ajukan Pengembalian
            </button>
        </div>
    );
}
