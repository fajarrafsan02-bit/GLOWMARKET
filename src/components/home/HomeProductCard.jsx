/* eslint-disable no-unused-vars */
import { Heart, ShoppingBag, Star, Scale, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "../../utils/format.js";
import { getProductImages } from "../../utils/productImages.js";
import ProductImageCarousel from "../catalog/ProductImageCarousel.jsx";

export default function HomeProductCard({
    p,
    isWishlisted,
    avgRating,
    reviewCount,
    onToggleWishlist,
    onAddToCart,
    onSelect,
}) {
    const rating = parseFloat(avgRating) || 0;
    const isOutOfStock = p.stock !== undefined && p.stock <= 0;

    return (
        <motion.article
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
            }}
            onClick={() => onSelect(p)}
            className="group relative cursor-pointer bg-white dark:bg-gray-950 overflow-hidden"
        >
            {/* ================= IMAGE ================= */}
            <div className={`relative aspect-[4/5] overflow-hidden bg-[#f5f3ee] dark:bg-gray-900 ${isOutOfStock ? "grayscale-[35%] opacity-85" : ""}`}>
                <ProductImageCarousel images={getProductImages(p)} alt={p.nama} />

                {/* Soft Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />

                {/* Out of Stock Grayscale & Badge Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-gray-950/25 backdrop-blur-[1px] z-30 flex items-center justify-center pointer-events-none">
                        <span className="px-3.5 py-1.5 bg-rose-600/90 text-white font-bold text-[10px] uppercase tracking-[0.2em] shadow-md rounded-md backdrop-blur-md">
                            Stok Habis
                        </span>
                    </div>
                )}

                {/* ================= KARAT ================= */}
                {p.karatEmas && (
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-white/95 dark:bg-black/80 backdrop-blur-sm text-[10px] uppercase tracking-[0.15em] font-medium text-gray-800 dark:text-gray-200">
                        {p.karatEmas}K Gold
                    </span>
                )}

                {/* ================= WISHLIST ================= */}
                <button
                    type="button"
                    aria-label={isWishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(p.id, e);
                    }}
                    className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-sm border border-white/50 dark:border-gray-700 flex items-center justify-center transition-all duration-300 hover:scale-105"
                >
                    <Heart
                        className={` w-4 h-4 transition-colors ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-500 dark:text-gray-300"} `}
                    />
                </button>

                {/* ================= HOVER ACTIONS ================= */}
                <div className="absolute left-3 right-3 bottom-3 z-20 flex gap-2 opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-400">
                    {/* View */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(p);
                        }}
                        className="flex-1 h-10 flex items-center justify-center gap-2 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm text-xs font-medium text-gray-900 dark:text-white transition-colors hover:bg-amber-500 hover:text-white"
                    >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        View
                    </button>

                    {/* Cart */}
                    <button
                        type="button"
                        aria-label={isOutOfStock ? "Stok habis" : "Tambah ke keranjang"}
                        disabled={isOutOfStock}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isOutOfStock) {
                                onSelect(p);
                            } else {
                                onAddToCart(p.id);
                            }
                        }}
                        className={`w-10 h-10 flex items-center justify-center transition-colors ${isOutOfStock ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed" : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-amber-500 hover:text-white"}`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ================= PRODUCT INFO ================= */}
            <div className="pt-4 pb-3">
                {/* Category */}
                <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
                        {p.karatEmas ? `${p.karatEmas}K Gold` : "Fine Jewelry"}
                    </span>

                    {p.stock !== undefined && (
                        <span className={`text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded ${isOutOfStock ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"}`}>
                            {isOutOfStock ? "Stok Habis" : `${p.stock} Tersedia`}
                        </span>
                    )}
                </div>

                {/* Name */}
                <h3 className="mt-1.5 text-sm md:text-[15px] font-medium leading-snug text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[2.5rem] transition-colors duration-300 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {p.nama}
                </h3>

                {/* Description */}
                {p.deskripsi && (
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
                        {p.deskripsi}
                    </p>
                )}

                {/* Weight + Rating */}
                <div className="mt-2.5 flex items-center justify-between gap-3">
                    {p.beratGram ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                            <Scale className="w-3.5 h-3.5" />
                            <span>{p.beratGram} gram</span>
                        </div>
                    ) : (
                        <span />
                    )}

                    <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />

                        <span className="font-medium">{rating > 0 ? rating.toFixed(1) : "-"}</span>

                        {reviewCount > 0 && <span className="text-gray-400">({reviewCount})</span>}
                    </div>
                </div>

                {/* Price */}
                <div className="mt-3">
                    <span className="text-base md:text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                        {formatPrice(p.harga)}
                    </span>
                </div>

                {/* Details Link */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] font-medium text-gray-400 transition-colors duration-300 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                        Discover
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                </div>
            </div>
        </motion.article>
    );
}
