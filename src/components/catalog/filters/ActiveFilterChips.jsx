import { X } from "lucide-react";

export default function ActiveFilterChips({
    hasCategoryFilter,
    hasKaratFilter,
    selectedCategory,
    onCategoryChange,
    selectedKarat,
    onKaratChange,
    onClear,
}) {
    return (
        <div className="flex items-center gap-2 flex-wrap lg:hidden">
            <span className="text-xs text-gray-400">Filter:</span>

            {hasCategoryFilter && (
                <button
                    type="button"
                    onClick={() => onCategoryChange("Semua")}
                    className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-amber-50 dark:bg-amber-900/20 text-xs text-amber-700 dark:text-amber-400"
                >
                    {selectedCategory}
                    <X className="w-3 h-3" />
                </button>
            )}

            {hasKaratFilter && (
                <button
                    type="button"
                    onClick={() => onKaratChange("Semua")}
                    className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300"
                >
                    {selectedKarat}
                    <X className="w-3 h-3" />
                </button>
            )}

            <button
                type="button"
                onClick={onClear}
                className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
            >
                Reset
            </button>
        </div>
    );
}
