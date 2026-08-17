import { Sparkles } from "lucide-react";

import ProductCard from "../catalog/ProductCard.jsx";

export default function RelatedProducts({
    products,
    wishlistIds,
    getRating,
    getReviewCount,
    onToggleWishlist,
    onAddToCart,
    onDetail,
}) {
    if (!products || products.length === 0) return null;

    return (
        <section className="mt-16 sm:mt-24 border-t border-gray-100 dark:border-gray-800 pt-12 sm:pt-16">
            <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />

                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-amber-600 dark:text-amber-400">
                    Rekomendasi
                </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-medium text-gray-900 dark:text-white mb-8">
                Produk Lainnya yang Mungkin Anda Suka
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {products.map((p) => (
                    <ProductCard
                        key={p.id}
                        p={p}
                        isWishlisted={wishlistIds.includes(p.id)}
                        avgRating={getRating ? getRating(p.id) : 0}
                        reviewCount={getReviewCount ? getReviewCount(p.id) : 0}
                        onToggleWishlist={onToggleWishlist}
                        onAddToCart={onAddToCart}
                        onDetail={onDetail}
                    />
                ))}
            </div>
        </section>
    );
}
