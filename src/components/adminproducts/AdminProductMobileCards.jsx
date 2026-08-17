import { Package, Edit3, Trash2 } from "lucide-react";

import ProductStatusBadge from "./ProductStatusBadge.jsx";

export default function AdminProductMobileCards({ items, formatPrice, onEdit, onDelete }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
            {items.map((product) => {
                const stock = Number(product.stock ?? product.stok ?? 0) || 0;

                const lowStock = stock > 0 && stock <= 5;

                const outOfStock = stock <= 0;

                return (
                    <div
                        key={product.id}
                        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                    >
                        {/* =================================================
                            IMAGE
                        ================================================== */}

                        <div className="relative aspect-[4/3] bg-gray-50 dark:bg-gray-800">
                            {product.gambar ? (
                                <img
                                    src={product.gambar}
                                    alt={product.nama}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
                                    <Package className="w-8 h-8" />

                                    <span className="mt-2 text-[10px]">Tidak ada gambar</span>
                                </div>
                            )}

                            {/* Karat */}
                            {product.karatEmas && (
                                <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-white/90 dark:bg-gray-900/90 backdrop-blur text-[10px] font-semibold text-amber-700 dark:text-amber-400 border border-white/50 dark:border-gray-700">
                                    {product.karatEmas}K
                                </span>
                            )}

                            {/* Status */}
                            <div className="absolute top-3 right-3">
                                <ProductStatusBadge status={product.status} />
                            </div>
                        </div>

                        {/* =================================================
                            CONTENT
                        ================================================== */}

                        <div className="p-3 sm:p-4">
                            {/* Name */}
                            <h3 className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                                {product.nama}
                            </h3>

                            {/* Specs */}
                            <div className="mt-1 sm:mt-1.5 flex items-center gap-2 text-[9px] sm:text-[10px] text-gray-400">
                                <span>{product.karatEmas}K</span>

                                <span>•</span>

                                <span>{product.beratGram}g</span>
                            </div>

                            {/* Price */}
                            <p className="mt-2 sm:mt-3 text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                                {formatPrice(product.harga)}
                            </p>

                            {/* Stock */}
                            <div className="mt-2 sm:mt-3 flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                                <div>
                                    <p className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400">
                                        Stok
                                    </p>

                                    <p
                                        className={` mt-0.5 text-[11px] sm:text-xs font-semibold ${outOfStock ? "text-red-600 dark:text-red-400" : lowStock ? "text-amber-600 dark:text-amber-400" : "text-gray-800 dark:text-gray-200"} `}
                                    >
                                        {stock} pcs
                                    </p>
                                </div>

                                {outOfStock ? (
                                    <span className="text-[8px] sm:text-[9px] font-medium text-red-500">
                                        Stok habis
                                    </span>
                                ) : lowStock ? (
                                    <span className="text-[8px] sm:text-[9px] font-medium text-amber-600 dark:text-amber-400">
                                        Stok menipis
                                    </span>
                                ) : (
                                    <span className="text-[8px] sm:text-[9px] text-gray-400">Stok aman</span>
                                )}
                            </div>

                            {/* =================================================
                                ACTIONS
                            ================================================== */}

                            <div className="mt-2.5 sm:mt-3 grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => onEdit(product)}
                                    className="h-8 sm:h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-600 dark:hover:text-amber-400 text-[10px] sm:text-[11px] font-medium flex items-center justify-center gap-1 sm:gap-1.5 transition"
                                >
                                    <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(product.id)}
                                    className="h-8 sm:h-9 rounded-lg border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-[10px] sm:text-[11px] font-medium flex items-center justify-center gap-1 sm:gap-1.5 transition"
                                >
                                    <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
