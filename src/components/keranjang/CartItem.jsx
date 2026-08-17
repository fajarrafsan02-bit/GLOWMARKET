import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { motion as Motion } from "framer-motion";

import { formatPrice } from "../../utils/format.js";
import {
    getQuantity,
    getProductName,
    getProductImage,
    getProductWeight,
    getProductPrice,
} from "../../utils/cartItem.js";

export default function CartItem({ item, index, onRemove, onUpdateQuantity }) {
    const price = getProductPrice(item);
    const quantity = getQuantity(item);
    const name = getProductName(item);
    const image = getProductImage(item);
    const weight = getProductWeight(item);

    const productLink = item.produk?.id ? `/produk/${item.produk.id}` : "#";

    return (
        <Motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="px-3 sm:px-5 py-4 sm:py-5 border-b last:border-b-0 border-gray-100 dark:border-gray-800"
        >
            <div className="flex gap-3 sm:gap-4">
                <Link
                    to={productLink}
                    className="w-16 h-16 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
                >
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                    )}
                </Link>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="min-w-0">
                            <Link
                                to={productLink}
                                className="text-xs sm:text-base font-medium leading-snug text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition"
                            >
                                {name}
                            </Link>

                            {item.namaVariant && (
                                <span className="mt-0.5 inline-block px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-gray-100 dark:bg-gray-800 text-[9px] sm:text-[10px] font-medium text-gray-600 dark:text-gray-300 rounded">
                                    {item.namaVariant}
                                </span>
                            )}

                            {(weight || item.produk?.karatEmas) && (
                                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-gray-400">
                                    {weight ? `${weight} gram` : ""}

                                    {weight && item.produk?.karatEmas ? " • " : ""}

                                    {item.produk?.karatEmas ? `${item.produk.karatEmas}K` : ""}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => onRemove(item.id)}
                            className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                            aria-label={`Hapus ${name}`}
                        >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                    </div>

                    <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2.5 sm:gap-3">
                        <div>
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400">
                                Harga
                            </p>

                            <p className="mt-0.5 text-[13px] sm:text-base font-semibold text-gray-900 dark:text-white">
                                {formatPrice(price)}
                            </p>
                        </div>

                        <div className="inline-flex items-center self-start sm:self-auto h-8 sm:h-9 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                                className="w-8 sm:w-9 h-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                aria-label="Kurangi jumlah"
                            >
                                <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>

                            <span className="min-w-7 sm:min-w-9 px-1.5 sm:px-2 text-center text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                                {quantity}
                            </span>

                            <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                                className="w-8 sm:w-9 h-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                aria-label="Tambah jumlah"
                            >
                                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Motion.article>
    );
}
