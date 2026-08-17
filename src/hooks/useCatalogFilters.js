export default function useCatalogFilters({
    selectedCategory,
    onCategoryChange,
    selectedKarat,
    onKaratChange,
}) {
    const hasCategoryFilter = selectedCategory !== "Semua";

    const hasKaratFilter = selectedKarat !== "Semua";

    const activeFilterCount = Number(hasCategoryFilter) + Number(hasKaratFilter);

    const clearFilters = () => {
        onCategoryChange("Semua");
        onKaratChange("Semua");
    };

    return { hasCategoryFilter, hasKaratFilter, activeFilterCount, clearFilters };
}
