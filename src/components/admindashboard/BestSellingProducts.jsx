/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Flame, ChevronRight, ShoppingBag } from "lucide-react";

export default function BestSellingProducts({ products = [] }) {
    return (
        <motion.section
            initial={{
                opacity: 0,
                y: 8,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.25,
            }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
        >
            {/* =================================================
                HEADER
            ================================================== */}

            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2.5 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-2.5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                        <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Produk Terlaris
                        </h2>

                        <p className="mt-0.5 text-[9px] sm:text-[10px] text-gray-400">
                            Berdasarkan jumlah terjual
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition"
                >
                    Lihat semua
                    <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </button>
            </div>

            {/* =================================================
                PRODUCT LIST
            ================================================== */}

            {products.length === 0 ? (
                <div className="px-4 sm:px-5 py-8 sm:py-10 text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                    </div>

                    <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                        Belum ada data produk
                    </p>

                    <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] text-gray-400">
                        Data akan tampil setelah ada transaksi.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {products.slice(0, 5).map((product, index) => (
                        <motion.button
                            key={product.id ?? `${product.name}-${index}`}
                            type="button"
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            transition={{
                                delay: index * 0.04,
                            }}
                            whileHover={{
                                backgroundColor: "rgba(249,250,251,1)",
                            }}
                            className="w-full px-3 sm:px-5 py-3 sm:py-3.5 flex items-center gap-2.5 sm:gap-3 text-left dark:hover:bg-gray-800 transition-colors"
                        >
                            {/* Rank */}
                            <div
                                className={` w-6 h-6 shrink-0 flex items-center justify-center text-[11px] font-semibold rounded-md ${index === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"} `}
                            >
                                {product.rank ?? index + 1}
                            </div>

                            {/* Image */}
                            <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                {product.image || product.gambar ? (
                                    <img
                                        src={product.image || product.gambar}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ShoppingBag className="w-4 h-4 m-3 text-gray-300 dark:text-gray-600" />
                                )}
                            </div>

                            {/* Product info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-200 truncate">
                                    {product.name}
                                </p>

                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-[10px] text-gray-400">
                                        {product.sales} terjual
                                    </span>

                                    {product.karat && (
                                        <>
                                            <span className="text-gray-300">•</span>

                                            <span className="text-[10px] text-gray-400">
                                                {product.karat}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="text-right shrink-0">
                                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                                    {product.price}
                                </p>

                                <p className="mt-0.5 text-[9px] text-gray-400">omzet</p>
                            </div>
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Footer */}
            {products.length > 5 && (
                <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
                    <button
                        type="button"
                        className="w-full text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 transition"
                    >
                        Lihat {products.length - 5} produk lainnya →
                    </button>
                </div>
            )}
        </motion.section>
    );
}
