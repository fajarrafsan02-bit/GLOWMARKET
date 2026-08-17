import { Search, Plus } from "lucide-react";

export default function AdminProductsToolbar({
    query,
    onQueryChange,
    statusFilter,
    onStatusFilterChange,
    onCreate,
}) {
    return (
        <div className="px-3 sm:px-5 py-2 sm:py-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                {/* =================================================
                    SEARCH
                ================================================== */}

                <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    <input
                        type="text"
                        value={query}
                        onChange={(event) => onQueryChange(event.target.value)}
                        placeholder="Cari nama produk..."
                        className="w-full h-9 sm:h-10 pl-9 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[11px] sm:text-xs text-gray-900 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                    />
                </div>

                {/* =================================================
                    STATUS FILTER

                    Penyaringannya dikerjakan server, jadi saat pencarian
                    nama aktif filter ini dinonaktifkan — keduanya memakai
                    endpoint yang berbeda dan tidak bisa digabung.
                ================================================== */}

                <select
                    value={statusFilter}
                    onChange={(event) => onStatusFilterChange(event.target.value)}
                    disabled={Boolean(query.trim())}
                    aria-label="Saring berdasarkan status"
                    className="h-9 sm:h-10 px-2 sm:px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[11px] sm:text-xs text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 disabled:opacity-40 transition shrink-0"
                >
                    <option value="">Semua status</option>
                    <option value="TERSEDIA">Tersedia</option>
                    <option value="TIDAK_TERSEDIA">Tidak Tersedia</option>
                    <option value="HABIS">Habis</option>
                </select>

                {/* =================================================
                    CREATE PRODUCT
                ================================================== */}

                <button
                    type="button"
                    onClick={onCreate}
                    className="h-9 sm:h-10 px-3 sm:px-5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition shrink-0"
                >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

                    <span>Tambah Produk</span>
                </button>
            </div>

            {/* Search context */}
            {query && (
                <p className="mt-2 text-[10px] text-gray-400">
                    Mencari produk dengan kata kunci{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">"{query}"</span>
                </p>
            )}
        </div>
    );
}
