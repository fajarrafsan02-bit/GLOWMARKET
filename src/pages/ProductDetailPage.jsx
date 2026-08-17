import { useParams, useNavigate, Link } from "react-router-dom";
import { PackageX, ArrowLeft } from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import KatalogToast from "../components/katalog/KatalogToast.jsx";

import ProductDetailBreadcrumb from "../components/productdetail/ProductDetailBreadcrumb.jsx";
import ProductDetailImage from "../components/productdetail/ProductDetailImage.jsx";
import ProductDetailRating from "../components/productdetail/ProductDetailRating.jsx";
import ProductDetailVariants from "../components/productdetail/ProductDetailVariants.jsx";
import ProductDetailMeta from "../components/productdetail/ProductDetailMeta.jsx";
import ProductDetailStock from "../components/productdetail/ProductDetailStock.jsx";
import ProductDetailTrust from "../components/productdetail/ProductDetailTrust.jsx";
import ProductDetailReviews from "../components/productdetail/ProductDetailReviews.jsx";
import ProductDetailActions from "../components/productdetail/ProductDetailActions.jsx";
import RelatedProducts from "../components/productdetail/RelatedProducts.jsx";

import useProductDetailPage from "../hooks/useProductDetailPage.js";
import useProductDetailModal from "../hooks/useProductDetailModal.js";
import { formatPrice } from "../utils/format.js";

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        product,
        loading,
        notFound,
        reviews,
        avgRating,
        reviewCount,
        relatedProducts,
        getRelatedRating,
        getRelatedReviewCount,
        wishlistIds,
        isWishlisted,
        notice,
        showAuth,
        setShowAuth,
        addToCart,
        toggleWishlist,
        daftarRestock,
    } = useProductDetailPage(id);

    const {
        variants,
        selectedVariantId,
        setSelectedVariantId,
        selectedVariant,
        displayPrice,
        displayStock,
        hasVariants,
        handleAddToCart,
    } = useProductDetailModal({ product, onAddToCart: addToCart });

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
                <Header setShowAuth={setShowAuth} />

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 animate-pulse">
                        <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-xl" />

                        <div className="space-y-4">
                            <div className="h-4 w-24 bg-gray-100 dark:bg-gray-900 rounded" />
                            <div className="h-8 w-3/4 bg-gray-100 dark:bg-gray-900 rounded" />
                            <div className="h-6 w-1/3 bg-gray-100 dark:bg-gray-900 rounded" />
                            <div className="h-24 w-full bg-gray-100 dark:bg-gray-900 rounded mt-8" />
                            <div className="h-12 w-full bg-gray-100 dark:bg-gray-900 rounded mt-8" />
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    if (notFound || !product) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
                <Header setShowAuth={setShowAuth} />

                <main className="flex-1 flex items-center justify-center px-4 py-24">
                    <div className="text-center max-w-sm">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                            <PackageX className="w-7 h-7 text-gray-400" />
                        </div>

                        <h1 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
                            Produk Tidak Ditemukan
                        </h1>

                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Produk yang Anda cari mungkin sudah tidak tersedia atau telah dihapus.
                        </p>

                        <Link
                            to="/katalog"
                            className="mt-6 inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Katalog
                        </Link>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    const rating = parseFloat(avgRating) || 0;

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
            <Header setShowAuth={setShowAuth} />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <ProductDetailBreadcrumb product={product} />

                <div className="flex flex-col md:flex-row gap-8 sm:gap-12 lg:gap-16">
                    <ProductDetailImage product={product} className="rounded-xl" />

                    <div className="flex-1">
                        <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-amber-600 dark:text-amber-400">
                            {product.kategori || "Fine Jewelry"}
                        </span>

                        <h1 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-serif font-medium leading-tight tracking-tight text-gray-900 dark:text-white">
                            {product.nama}
                        </h1>

                        <ProductDetailRating rating={rating} reviewCount={reviewCount} />

                        <div className="mt-7">
                            <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                {formatPrice(displayPrice)}
                            </p>

                            {hasVariants && (
                                <p className="mt-1 text-[11px] text-gray-400">
                                    Harga menyesuaikan pilihan di bawah
                                </p>
                            )}
                        </div>

                        {hasVariants && (
                            <ProductDetailVariants
                                variants={variants}
                                selectedVariantId={selectedVariantId}
                                onSelect={setSelectedVariantId}
                            />
                        )}

                        <ProductDetailMeta product={product} />

                        <ProductDetailStock displayStock={displayStock} />

                        <ProductDetailTrust />

                        {product.deskripsi && (
                            <div className="mt-7">
                                <h3 className="text-[10px] uppercase tracking-[0.18em] font-medium text-gray-400">
                                    About This Piece
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                                    {product.deskripsi}
                                </p>
                            </div>
                        )}

                        <ProductDetailReviews reviews={reviews} reviewCount={reviewCount} />

                        <ProductDetailActions
                            isWishlisted={isWishlisted}
                            displayStock={displayStock}
                            productId={product.id}
                            onToggleWishlist={toggleWishlist}
                            onAddToCart={handleAddToCart}
                            onRestockNotif={() =>
                                daftarRestock(product, selectedVariant ? selectedVariant.id : null)
                            }
                        />
                    </div>
                </div>

                <RelatedProducts
                    products={relatedProducts}
                    wishlistIds={wishlistIds}
                    getRating={getRelatedRating}
                    getReviewCount={getRelatedReviewCount}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                    onDetail={(p) => navigate(`/produk/${p.id}`)}
                />
            </main>

            <KatalogToast notice={notice} />

            <Footer />
            <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </div>
    );
}
