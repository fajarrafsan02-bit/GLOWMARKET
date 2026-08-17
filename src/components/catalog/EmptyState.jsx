import { SearchX, RotateCcw } from "lucide-react";

export default function EmptyState({ onReset }) {
    return (
        <div className="w-full py-16 sm:py-20 px-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center text-center">
            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <SearchX className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>

            {/* Title */}
            <h3 className="mt-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Produk Tidak Ditemukan
            </h3>

            {/* Description */}
            <p className="mt-1.5 max-w-sm text-xs sm:text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                Produk yang sesuai dengan pencarian atau filter saat ini tidak tersedia.
            </p>

            {/* Action */}
            <button
                type="button"
                onClick={onReset}
                className="mt-5 h-9 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
            >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filter
            </button>
        </div>
    );
}
