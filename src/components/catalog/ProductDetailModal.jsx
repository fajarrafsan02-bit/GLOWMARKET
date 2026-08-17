import { X } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import { formatPrice } from "../../utils/format.js";

import useProductDetailModal from "../../hooks/useProductDetailModal.js";

import ProductDetailImage from "../productdetail/ProductDetailImage.jsx";
import ProductDetailRating from "../productdetail/ProductDetailRating.jsx";
import ProductDetailVariants from "../productdetail/ProductDetailVariants.jsx";
import ProductDetailMeta from "../productdetail/ProductDetailMeta.jsx";
import ProductDetailStock from "../productdetail/ProductDetailStock.jsx";
import ProductDetailTrust from "../productdetail/ProductDetailTrust.jsx";
import ProductDetailReviews from "../productdetail/ProductDetailReviews.jsx";
import ProductDetailActions from "../productdetail/ProductDetailActions.jsx";

export default function ProductDetailModal({
    product,
    reviews = [],
    avgRating,
    reviewCount,
    isWishlisted,
    onClose,
    onAddToCart,
    onToggleWishlist,
    onDetail,
    onRestockNotif,
}) {
    const {
        variants,
        selectedVariantId,
        setSelectedVariantId,
        selectedVariant,
        displayPrice,
        displayStock,
        hasVariants,
        handleAddToCart,
    } = useProductDetailModal({ product, onAddToCart });

    if (!product) return null;

    const rating = parseFloat(avgRating) || 0;

    return (
        <AnimatePresence>
            <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onClose}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto"
            >
                <Motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.97 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-4xl max-h-[92vh] md:max-h-[85vh] rounded-2xl overflow-hidden bg-white dark:bg-gray-950 shadow-2xl flex flex-col md:flex-row my-auto border border-gray-200 dark:border-gray-800"
                >
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup"
                        className="absolute top-3 right-3 z-30 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 transition-all duration-300 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <ProductDetailImage product={product} />

                    <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-8 md:py-8">
                        <div className="max-w-xl">
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-semibold text-amber-600 dark:text-amber-400">
                                Fine Jewelry
                            </span>

                            <h2 className="mt-1 pr-6 text-sm xs:text-base sm:text-2xl lg:text-3xl font-serif font-bold leading-snug tracking-tight text-gray-900 dark:text-white line-clamp-2">
                                {product.nama}
                            </h2>

                            <ProductDetailRating rating={rating} reviewCount={reviewCount} />

                            <div className="mt-3 sm:mt-6">
                                <p className="text-xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
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
                                onToggleWishlist={onToggleWishlist}
                                onAddToCart={handleAddToCart}
                                onRestockNotif={() =>
                                    onRestockNotif?.(
                                        product,
                                        selectedVariant ? selectedVariant.id : null,
                                    )
                                }
                                onFullDetail={() => {
                                    onClose();
                                    onDetail?.(product);
                                }}
                            />
                        </div>
                    </div>
                </Motion.div>
            </Motion.div>
        </AnimatePresence>
    );
}
