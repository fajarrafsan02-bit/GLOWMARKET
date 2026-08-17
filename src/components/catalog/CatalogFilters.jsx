import useCatalogFilters from "../../hooks/useCatalogFilters.js";

import CatalogSearch from "./filters/CatalogSearch.jsx";
import FilterControls from "./filters/FilterControls.jsx";
import DesktopFilterBar from "./filters/DesktopFilterBar.jsx";
import ActiveFilterChips from "./filters/ActiveFilterChips.jsx";
import MobileFilterPanel from "./filters/MobileFilterPanel.jsx";

export default function CatalogFilters({
    query,
    onQueryChange,
    sortBy,
    onSortChange,
    selectedCategory,
    onCategoryChange,
    selectedKarat,
    onKaratChange,
    showFilters,
    onToggleFilters,
    categories,
    karatOptions,
}) {
    const { hasCategoryFilter, hasKaratFilter, activeFilterCount, clearFilters } =
        useCatalogFilters({
            selectedCategory,
            onCategoryChange,
            selectedKarat,
            onKaratChange,
        });

    return (
        <div className="space-y-3">
            {/* Top bar */}
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
                <CatalogSearch query={query} onQueryChange={onQueryChange} />

                <FilterControls
                    activeFilterCount={activeFilterCount}
                    onToggleFilters={onToggleFilters}
                    sortBy={sortBy}
                    onSortChange={onSortChange}
                />
            </div>

            {/* Desktop filter bar */}
            <DesktopFilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
                selectedKarat={selectedKarat}
                onKaratChange={onKaratChange}
                categories={categories}
                karatOptions={karatOptions}
                activeFilterCount={activeFilterCount}
                onClear={clearFilters}
            />

            {/* Active filters */}
            {(hasCategoryFilter || hasKaratFilter) && (
                <ActiveFilterChips
                    hasCategoryFilter={hasCategoryFilter}
                    hasKaratFilter={hasKaratFilter}
                    selectedCategory={selectedCategory}
                    onCategoryChange={onCategoryChange}
                    selectedKarat={selectedKarat}
                    onKaratChange={onKaratChange}
                    onClear={clearFilters}
                />
            )}

            {/* Mobile filter panel */}
            <MobileFilterPanel
                showFilters={showFilters}
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
                selectedKarat={selectedKarat}
                onKaratChange={onKaratChange}
                categories={categories}
                karatOptions={karatOptions}
                activeFilterCount={activeFilterCount}
                onClear={clearFilters}
            />
        </div>
    );
}
