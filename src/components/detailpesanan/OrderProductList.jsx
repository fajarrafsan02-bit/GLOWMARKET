import { ShoppingBag } from "lucide-react";

import { formatPrice, toMoney } from "../../utils/format.js";

export default function OrderProductList({ items, totalItems }) {
    return (
        <>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map((item, index) => {
                    const product = item.produk || {};
                    const quantity = item.quantity ?? item.jumlah ?? 1;
                    const price = toMoney(item.hargaSatuan ?? item.harga ?? product.harga);
                    const name = item.namaProduk || product.nama || "Produk Emas";
                    const image = item.gambarProduk || product.gambar;
                    const karat = item.karatEmas || product.karatEmas;
                    const weight = item.beratGram || product.beratGram;
                    const itemSubtotal =
                        item.subtotal != null ? toMoney(item.subtotal) : price * quantity;

                    return (
                        <div
                            key={item.id || index}
                            className="px-3 py-3 sm:px-5 sm:py-4 flex gap-2.5 sm:gap-4"
                        >
                            <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-sm">
                                {image ? (
                                    <img
                                        src={image}
                                        alt={name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-2">
                                    {name}
                                </h3>

                                <div className="mt-0.5 sm:mt-1 flex flex-wrap gap-1.5 sm:gap-2">
                                    {karat && (
                                        <span className="text-[9px] sm:text-[10px] text-gray-400">
                                            {karat}K
                                        </span>
                                    )}

                                    {weight && (
                                        <span className="text-[9px] sm:text-[10px] text-gray-400">
                                            {weight} gram
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-400">
                                    {quantity} × {formatPrice(price)}
                                </p>
                            </div>

                            <div className="text-right shrink-0">
                                <p className="text-[11px] sm:text-sm font-semibold text-gray-900 dark:text-white">
                                    {formatPrice(itemSubtotal)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalItems > items.length && (
                <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
                    +{totalItems - items.length} item lainnya
                </div>
            )}
        </>
    );
}
