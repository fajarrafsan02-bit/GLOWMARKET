import { Search, ArrowDown, ArrowUp, X } from "lucide-react";

const tabs = [
    {
        key: "all",
        label: "Semua",
    },
    {
        key: "pending",
        label: "Belum Bayar",
    },
    {
        key: "processing",
        label: "Diproses",
    },
    {
        key: "shipped",
        label: "Dikirim",
    },
    {
        key: "completed",
        label: "Selesai",
    },
    {
        key: "cancelled",
        label: "Dibatalkan",
    },
    {
        key: "returned",
        label: "Pengembalian",
    },
];

export default function OrderFilterBar({
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
}) {
    return (
        <div>
            {/* =====================================================
                STATUS TABS
            ====================================================== */}
            <div className="border-b border-gray-200 dark:border-gray-800 overflow-x-auto scrollbar-hide">
                <div className="flex min-w-max px-4 sm:px-5">
                    {tabs.map((tab) => {
                        const active = activeTab === tab.key;

                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={` relative px-4 sm:px-5 py-4 text-sm whitespace-nowrap transition-colors duration-200 ${active ? "text-amber-600 dark:text-amber-400 font-medium" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"} `}
                            >
                                {tab.label}

                                {/* Active underline */}
                                {active && (
                                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* =====================================================
                SEARCH + SORT
            ====================================================== */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50/60 dark:bg-gray-950/40">
                {/* Search */}
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari nomor pesanan..."
                        className="w-full h-10 pl-10 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
                    />

                    {/* Clear search */}
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            aria-label="Hapus pencarian"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Sort */}
                <button
                    type="button"
                    onClick={() =>
                        setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
                    }
                    className="h-10 px-3.5 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white transition-all"
                    aria-label={
                        sortOrder === "newest" ? "Urutkan dari terbaru" : "Urutkan dari terlama"
                    }
                >
                    {sortOrder === "newest" ? (
                        <ArrowDown className="w-4 h-4" />
                    ) : (
                        <ArrowUp className="w-4 h-4" />
                    )}

                    <span>{sortOrder === "newest" ? "Terbaru" : "Terlama"}</span>
                </button>
            </div>
        </div>
    );
}
