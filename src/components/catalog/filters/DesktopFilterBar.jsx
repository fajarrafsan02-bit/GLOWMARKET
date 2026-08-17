import { CategoryPicker, KaratPicker } from "./FilterButtons.jsx";

export default function DesktopFilterBar({
    selectedCategory,
    onCategoryChange,
    selectedKarat,
    onKaratChange,
    categories,
    karatOptions,
    activeFilterCount,
    onClear,
}) {
    return (
        <div className="hidden lg:flex items-center gap-2 min-h-10 py-1">
            {/* Category */}
            <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400 mr-1">Kategori:</span>

                <CategoryPicker
                    categories={categories}
                    selected={selectedCategory}
                    onSelect={onCategoryChange}
                    variant="pill"
                />
            </div>

            {/* Divider */}
            <span className="w-px h-5 bg-gray-200 dark:bg-gray-800 mx-1" />

            {/* Karat */}
            <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-gray-400 mr-1">Karat:</span>

                <KaratPicker
                    karatOptions={karatOptions}
                    selected={selectedKarat}
                    onSelect={onKaratChange}
                    variant="pill"
                />
            </div>

            {/* Clear */}
            {activeFilterCount > 0 && (
                <button
                    type="button"
                    onClick={onClear}
                    className="ml-auto text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 transition"
                >
                    Hapus filter
                </button>
            )}
        </div>
    );
}
