/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import WishlistCard from "../../components/wishlist/WishlistCard.jsx";

export default function WishlistSection({ loading, items, onRemove, onAddToCart, formatPrice }) {
    const count = items.length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                        Wishlist
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {loading
                            ? "Memuat produk favorit..."
                            : count > 0
                              ? `${count} produk tersimpan di wishlist`
                              : "Produk favorit Anda akan muncul di sini."}
                    </p>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-pulse"
                        >
                            <div className="aspect-square bg-gray-100 dark:bg-gray-800" />

                            <div className="p-3 space-y-2">
                                <div className="h-3 w-4/5 rounded bg-gray-100 dark:bg-gray-800" />
                                <div className="h-3 w-2/5 rounded bg-gray-100 dark:bg-gray-800" />
                                <div className="h-9 w-full rounded-lg bg-gray-100 dark:bg-gray-800" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && count === 0 && (
                <div className="py-14 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <Heart className="h-7 w-7 text-gray-400" />
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Wishlist masih kosong
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                        Simpan perhiasan favorit Anda agar mudah ditemukan kembali saat ingin
                        berbelanja.
                    </p>

                    <Link
                        to="/katalog"
                        className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-amber-500 px-5 text-sm font-semibold text-white hover:bg-amber-600 transition"
                    >
                        Lihat Katalog
                    </Link>
                </div>
            )}

            {/* Product Grid */}
            {!loading && count > 0 && (
                <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                    <AnimatePresence>
                        {items.map((item) => {
                            if (!item.produk) return null;

                            return (
                                <WishlistCard
                                    key={item.id}
                                    item={item}
                                    onRemove={onRemove}
                                    onAddToCart={onAddToCart}
                                    formatPrice={formatPrice}
                                />
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}
        </motion.div>
    );
}
