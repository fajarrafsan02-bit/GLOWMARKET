import { Heart, ShoppingBag, BellRing, ArrowUpRight } from "lucide-react";
import { motion as Motion } from "framer-motion";

export default function ProductModalActions({
    isWishlisted,
    isAvailable,
    product,
    selectedVariant,
    onToggleWishlist,
    onAddToCart,
    onRestockNotif,
    onViewFullDetails,
}) {
    return (
        <div className="sticky bottom-0 mt-3 pt-2 pb-0.5 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
            <div className="flex gap-2">
                {/* Wishlist */}
                <button
                    type="button"
                    onClick={(e) => onToggleWishlist(product.id, e)}
                    aria-label="Wishlist"
                    className={`w-9 h-9 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center border rounded-lg transition-all duration-300 ${
                        isWishlisted
                            ? "border-rose-300 bg-rose-50 text-rose-500"
                            : "border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white"
                    }`}
                >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
                </button>

                {/* Cart / Restock */}
                {isAvailable ? (
                    <Motion.button
                        type="button"
                        whileTap={{
                            scale: 0.98,
                        }}
                        disabled={!isAvailable}
                        onClick={() =>
                            onAddToCart(product, selectedVariant ? selectedVariant.id : null)
                        }
                        className="flex-1 h-9 sm:h-11 flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[11px] sm:text-xs uppercase tracking-[0.08em] sm:tracking-[0.1em] font-semibold transition-all duration-300 hover:bg-amber-600 dark:hover:bg-amber-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />

                        {isAvailable ? "Add to Cart" : "Out of Stock"}
                    </Motion.button>
                ) : (
                    <Motion.button
                        type="button"
                        whileTap={{
                            scale: 0.98,
                        }}
                        onClick={() =>
                            onRestockNotif?.(product, selectedVariant ? selectedVariant.id : null)
                        }
                        className="flex-1 h-9 sm:h-11 flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] sm:text-xs uppercase tracking-[0.08em] sm:tracking-[0.1em] font-semibold transition-all duration-300"
                    >
                        <BellRing className="w-3.5 h-3.5" />
                        Beri Tahu Saya
                    </Motion.button>
                )}
            </div>

            {/* Full Detail */}
            <button
                type="button"
                onClick={onViewFullDetails}
                className="w-full h-8 sm:h-9 mt-2 flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/50 bg-amber-50/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:bg-amber-600 hover:border-amber-600 hover:text-white dark:hover:bg-amber-500 dark:hover:border-amber-500 dark:hover:text-white shadow-sm"
            >
                <span>Lihat Detail Selengkapnya</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
