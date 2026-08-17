import { Search, RefreshCw, ArrowUp, ArrowDown, X } from "lucide-react";

export default function OrdersToolbar({
    query,
    onQueryChange,
    sortOrder,
    onToggleSort,
    itemsPerPage,
    onItemsPerPageChange,
    onRefresh,
    loading,
}) {
    return (
        <div className="px-3 sm:px-5 py-2 sm:py-3">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 sm:gap-3">
                {/* =================================================
                    SEARCH
                ================================================== */}

                <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    <input
                        type="text"
                        value={query}
                        onChange={(event) => onQueryChange(event.target.value)}
                        placeholder="Cari pesanan, pelanggan, atau email..."
                        className="w-full h-9 sm:h-10 pl-9 pr-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[11px] sm:text-xs text-gray-900 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={() => onQueryChange("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            aria-label="Hapus pencarian"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* =================================================
                    CONTROLS
                ================================================== */}

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Sort */}
                    <button
                        type="button"
                        onClick={onToggleSort}
                        className="h-9 sm:h-10 px-2 sm:px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition inline-flex items-center gap-1.5 sm:gap-2"
                    >
                        {sortOrder === "newest" ? (
                            <ArrowDown className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                            <ArrowUp className="w-3.5 h-3.5 text-amber-500" />
                        )}

                        <span className="hidden sm:inline text-[11px] font-medium">
                            {sortOrder === "newest" ? "Terbaru" : "Terlama"}
                        </span>
                    </button>

                    {/* Per Page */}
                    <div className="h-9 sm:h-10 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <span className="hidden sm:inline text-[10px] text-gray-400">
                            Tampilkan
                        </span>

                        <select
                            value={itemsPerPage}
                            onChange={(event) => onItemsPerPageChange(Number(event.target.value))}
                            className="bg-transparent text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
                            aria-label="Jumlah pesanan per halaman"
                        >
                            <option value={5}>5</option>

                            <option value={10}>10</option>

                            <option value={25}>25</option>

                            <option value={50}>50</option>
                        </select>
                    </div>

                    {/* Refresh */}
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={loading}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        title="Refresh pesanan"
                        aria-label="Refresh pesanan"
                    >
                        <RefreshCw className={` w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? "animate-spin" : ""} `} />
                    </button>
                </div>
            </div>

            {/* Active Search */}
            {query && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-400">
                    <span>Hasil pencarian untuk</span>

                    <span className="font-medium text-gray-700 dark:text-gray-300">"{query}"</span>
                </div>
            )}
        </div>
    );
}
