import { ChevronDown, SlidersHorizontal } from "lucide-react";

export default function FilterControls({
    activeFilterCount,
    onToggleFilters,
    sortBy,
    onSortChange,
}) {
    return (
        <div className="flex items-center gap-2">
            {/* Mobile Filter */}
            <button
                type="button"
                onClick={onToggleFilters}
                className="lg:hidden h-11 px-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2 transition hover:border-gray-300 dark:hover:border-gray-600"
            >
                <SlidersHorizontal className="w-4 h-4" />

                <span>Filter</span>

                {activeFilterCount > 0 && (
                    <span className="min-w-5 h-5 px-1 rounded-full bg-amber-500 text-white text-[10px] font-semibold flex items-center justify-center">
                        {activeFilterCount}
                    </span>
                )}
            </button>

            {/* Sort */}
            <div className="relative">
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="h-11 appearance-none min-w-[150px] pl-3.5 pr-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 cursor-pointer"
                >
                    <option value="terbaru">Terbaru</option>
                    <option value="terlaris">Terlaris</option>
                    <option value="harga_asc">Harga Terendah</option>
                    <option value="harga_desc">Harga Tertinggi</option>
                    <option value="karat_asc">Karat Terendah</option>
                    <option value="karat_desc">Karat Tertinggi</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
        </div>
    );
}
