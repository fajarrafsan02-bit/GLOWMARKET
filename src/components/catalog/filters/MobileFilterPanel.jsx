import { AnimatePresence, motion as Motion } from "framer-motion";

import { CategoryPicker, KaratPicker } from "./FilterButtons.jsx";

function FilterSection({ title, showReset, onReset, children }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs uppercase tracking-[0.12em] font-semibold text-gray-500 dark:text-gray-400">
                    {title}
                </h3>

                {showReset && (
                    <button type="button" onClick={onReset} className="text-xs text-amber-600 dark:text-amber-400">
                        Reset
                    </button>
                )}
            </div>

            {children}
        </div>
    );
}

export default function MobileFilterPanel({
    showFilters,
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
        <AnimatePresence>
            {showFilters && (
                <Motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="lg:hidden overflow-hidden"
                >
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 space-y-6">
                        {/* Category */}
                        <FilterSection
                            title="Kategori"
                            showReset={selectedCategory !== "Semua"}
                            onReset={() => onCategoryChange("Semua")}
                        >
                            <div className="flex flex-wrap gap-2">
                                <CategoryPicker
                                    categories={categories}
                                    selected={selectedCategory}
                                    onSelect={onCategoryChange}
                                    variant="box"
                                />
                            </div>
                        </FilterSection>

                        {/* Karat */}
                        <FilterSection
                            title="Karat Emas"
                            showReset={selectedKarat !== "Semua"}
                            onReset={() => onKaratChange("Semua")}
                        >
                            <div className="grid grid-cols-3 gap-2">
                                <KaratPicker
                                    karatOptions={karatOptions}
                                    selected={selectedKarat}
                                    onSelect={onKaratChange}
                                    variant="box"
                                />
                            </div>
                        </FilterSection>

                        {/* Reset All */}
                        {activeFilterCount > 0 && (
                            <button
                                type="button"
                                onClick={onClear}
                                className="w-full h-10 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition"
                            >
                                Hapus Semua Filter
                            </button>
                        )}
                    </div>
                </Motion.div>
            )}
        </AnimatePresence>
    );
}
