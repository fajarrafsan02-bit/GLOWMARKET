import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import CatalogFilters from "../components/catalog/CatalogFilters.jsx";
import ProductCard from "../components/catalog/ProductCard.jsx";
import ProductDetailModal from "../components/catalog/ProductDetailModal.jsx";
import Pagination from "../components/catalog/Pagination.jsx";
import LoadingGrid from "../components/catalog/LoadingGrid.jsx";
import EmptyState from "../components/catalog/EmptyState.jsx";
import KatalogHero from "../components/katalog/KatalogHero.jsx";
import KatalogResultsInfo from "../components/katalog/KatalogResultsInfo.jsx";
import KatalogToast from "../components/katalog/KatalogToast.jsx";
import { PRODUCT_CATEGORIES as categories, KARAT_OPTIONS } from "../utils/productCategory.js";
import useKatalog from "../hooks/useKatalog.js";

export default function Katalog() {
    const navigate = useNavigate();

    const {
        loading,
        query,
        setQuery,
        notice,
        selected,
        setSelected,
        showAuth,
        setShowAuth,
        wishlistIds,
        selectedCategory,
        setSelectedCategory,
        selectedKarat,
        setSelectedKarat,
        sortBy,
        setSortBy,
        showFilters,
        setShowFilters,
        currentPage,
        setCurrentPage,
        filteredSortedItems,
        currentItems,
        totalPages,
        productReviews,
        getAverageRating,
        getReviewCount,
        addToCart,
        toggleWishlist,
        handleDetail,
        daftarRestock,
        resetFilters,
    } = useKatalog();

    return (
        <div className="relative min-h-screen bg-gray-50 overflow-x-hidden">
            <Header setShowAuth={setShowAuth} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
                <KatalogHero productCount={filteredSortedItems.length} />

                <CatalogFilters
                    query={query}
                    onQueryChange={setQuery}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    selectedKarat={selectedKarat}
                    onKaratChange={setSelectedKarat}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    categories={categories}
                    karatOptions={KARAT_OPTIONS}
                />

                {!loading && (
                    <KatalogResultsInfo
                        shown={currentItems.length}
                        total={filteredSortedItems.length}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        selectedCategory={selectedCategory}
                        selectedKarat={selectedKarat}
                    />
                )}

                {loading && <LoadingGrid />}

                {!loading && filteredSortedItems.length === 0 && (
                    <div className="mt-16">
                        <EmptyState onReset={resetFilters} />
                    </div>
                )}

                {!loading && currentItems.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                            <AnimatePresence>
                                {currentItems.map((p, i) => (
                                    <ProductCard
                                        key={p.id}
                                        p={p}
                                        isWishlisted={wishlistIds.includes(p.id)}
                                        avgRating={getAverageRating(p.id)}
                                        reviewCount={getReviewCount(p.id)}
                                        onToggleWishlist={toggleWishlist}
                                        onAddToCart={addToCart}
                                        onDetail={handleDetail}
                                        index={i}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-20">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </main>

            <ProductDetailModal
                product={selected}
                reviews={selected ? productReviews[selected.id] || [] : []}
                avgRating={selected ? getAverageRating(selected.id) : null}
                reviewCount={selected ? getReviewCount(selected.id) : 0}
                isWishlisted={selected ? wishlistIds.includes(selected.id) : false}
                onClose={() => setSelected(null)}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                onRestockNotif={daftarRestock}
                onDetail={(p) => navigate(`/produk/${p.id}`)}
            />

            <KatalogToast notice={notice} />

            <Footer />
            <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </div>
    );
}
