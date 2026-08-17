import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Trash2, ShoppingCart, ShieldCheck } from "lucide-react";

import { getProductImages } from "../../utils/productImages.js";
import ProductImageCarousel from "../catalog/ProductImageCarousel.jsx";

export default function WishlistCard({ item, onRemove, onAddToCart, formatPrice }) {
    const product = item.produk;
    const images = getProductImages(product);

    return (
        <Motion.article
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="group overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
        >
            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                <ProductImageCarousel images={images} alt={product.nama} />

                <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Hapus ${product.nama} dari wishlist`}
                    title="Hapus dari wishlist"
                    className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-200 transition"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>

                {product.karatEmas && (
                    <span className="absolute left-2 bottom-2 z-10 px-2 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                        {product.karatEmas}K
                    </span>
                )}
            </div>

            <div className="p-2 sm:p-3">
                <Link
                    to={`/produk/${product.id}`}
                    className="block min-h-[2rem] sm:min-h-[2.5rem] text-xs sm:text-sm font-medium leading-snug text-gray-900 dark:text-white line-clamp-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    title={product.nama}
                >
                    {product.nama}
                </Link>

                {product.beratGram && (
                    <p className="mt-1 text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500">
                        {product.beratGram} gram
                    </p>
                )}

                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base font-bold text-gray-900 dark:text-white">
                    {formatPrice(product.harga)}
                </p>

                <div className="mt-1.5 sm:mt-2 flex items-center gap-1 sm:gap-1.5">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />

                    <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 line-clamp-1">
                        Produk terverifikasi
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => onAddToCart(product)}
                    className="mt-2.5 sm:mt-3 w-full h-8 sm:h-9 rounded-md sm:rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 transition"
                >
                    <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">+ Keranjang</span>
                </button>
            </div>
        </Motion.article>
    );
}
