import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import ProductModalImage from "../homemodal/ProductModalImage.jsx";
import ProductModalRating from "../homemodal/ProductModalRating.jsx";
import ProductModalPrice from "../homemodal/ProductModalPrice.jsx";
import ProductModalVariants from "../homemodal/ProductModalVariants.jsx";
import ProductModalAttributes from "../homemodal/ProductModalAttributes.jsx";
import ProductModalStock from "../homemodal/ProductModalStock.jsx";
import ProductModalTrustSignals from "../homemodal/ProductModalTrustSignals.jsx";
import ProductModalAuthenticity from "../homemodal/ProductModalAuthenticity.jsx";
import ProductModalDescription from "../homemodal/ProductModalDescription.jsx";
import ProductModalReviews from "../homemodal/ProductModalReviews.jsx";
import ProductModalActions from "../homemodal/ProductModalActions.jsx";

export default function HomeProductModal({
    selectedProduct,
    setSelectedProduct,
    wishlistIds,
    toggleWishlist,
    addToCart,
    getAverageRating,
    getReviewCount,
    productReviews,
    formatPrice,
    navigate,
    onRestockNotif,
}) {
    const variants = selectedProduct?.varian || [];
    const [selectedVariantId, setSelectedVariantId] = useState(null);

    useEffect(() => {
        setSelectedVariantId(variants.length ? variants[0].id : null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct?.id]);

    if (!selectedProduct) return null;

    const avgRating = parseFloat(getAverageRating(selectedProduct.id)) || 0;

    const reviewCount = getReviewCount(selectedProduct.id) || 0;

    const reviews = productReviews[selectedProduct.id] || [];

    const isWishlisted = wishlistIds.includes(selectedProduct.id);

    const selectedVariant = variants.find((v) => v.id === selectedVariantId) || null;
    const displayPrice = selectedVariant ? selectedVariant.harga : selectedProduct.harga;
    const displayStock = selectedVariant ? selectedVariant.stock : selectedProduct.stock;
    const isAvailable = (displayStock ?? 0) > 0;

    return (
        <AnimatePresence>
            <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProduct(null)}
                className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto"
            >
                <Motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                        scale: 0.97,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    exit={{
                        opacity: 0,
                        y: 20,
                        scale: 0.97,
                    }}
                    transition={{
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-4xl max-h-[92vh] md:max-h-[85vh] rounded-2xl overflow-hidden bg-white dark:bg-gray-950 flex flex-col md:flex-row my-auto shadow-2xl border border-gray-200 dark:border-gray-800"
                >
                    {/* =====================================================
                        CLOSE
                    ====================================================== */}
                    <button
                        type="button"
                        onClick={() => setSelectedProduct(null)}
                        aria-label="Tutup"
                        className="absolute top-3 right-3 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/90 dark:bg-black/80 backdrop-blur-md border border-white/50 dark:border-gray-700 text-gray-500 dark:text-gray-300 transition-all duration-300 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* =====================================================
                        LEFT — PRODUCT IMAGE
                    ====================================================== */}
                    <ProductModalImage product={selectedProduct} />

                    {/* =====================================================
                        RIGHT — PRODUCT INFORMATION
                    ====================================================== */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-8 md:py-8">
                        <div className="max-w-xl">
                            {/* Category */}
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.24em] font-semibold text-amber-600 dark:text-amber-400">
                                Featured Jewelry
                            </span>

                            {/* Product Name */}
                            <h2 className="mt-1 pr-6 text-sm xs:text-base sm:text-2xl lg:text-3xl font-serif font-bold leading-snug tracking-tight text-gray-900 dark:text-white line-clamp-2">
                                {selectedProduct.nama}
                            </h2>

                            {/* Rating */}
                            <ProductModalRating avgRating={avgRating} reviewCount={reviewCount} />

                            {/* Price */}
                            <ProductModalPrice
                                displayPrice={displayPrice}
                                formatPrice={formatPrice}
                            />

                            {/* Varian */}
                            {variants.length > 0 && (
                                <ProductModalVariants
                                    variants={variants}
                                    selectedVariantId={selectedVariantId}
                                    onSelectVariant={setSelectedVariantId}
                                    formatPrice={formatPrice}
                                />
                            )}

                            {/* Attributes */}
                            <ProductModalAttributes product={selectedProduct} />

                            {/* Stock */}
                            <ProductModalStock displayStock={displayStock} isAvailable={isAvailable} />

                            {/* Trust Signals */}
                            <ProductModalTrustSignals />

                            {/* Authenticity */}
                            <ProductModalAuthenticity />

                            {/* Description */}
                            <ProductModalDescription product={selectedProduct} />

                            {/* Reviews */}
                            <ProductModalReviews
                                reviews={reviews}
                                onSeeAll={() => {
                                    setSelectedProduct(null);
                                    navigate("/katalog");
                                }}
                            />

                            {/* Actions */}
                            <ProductModalActions
                                isWishlisted={isWishlisted}
                                isAvailable={isAvailable}
                                product={selectedProduct}
                                selectedVariant={selectedVariant}
                                onToggleWishlist={toggleWishlist}
                                onAddToCart={addToCart}
                                onRestockNotif={onRestockNotif}
                                onViewFullDetails={() => {
                                    setSelectedProduct(null);
                                    navigate(`/produk/${selectedProduct.id}`);
                                }}
                            />
                        </div>
                    </div>
                </Motion.div>
            </Motion.div>
        </AnimatePresence>
    );
}
