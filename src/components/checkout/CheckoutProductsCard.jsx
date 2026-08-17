import { ShoppingBag } from "lucide-react";
import { formatPrice } from "../../utils/format.js";
import { getQuantity, getPrice, getName, getImage, getWeight } from "../../utils/cartItem.js";

export default function CheckoutProductsCard({ items, totalQuantity, onUbahKeranjang }) {
    return (
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                            Produk Pesanan
                        </h2>

                        <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-400">{totalQuantity} item</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onUbahKeranjang}
                    className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-amber-600 transition shrink-0 ml-2"
                >
                    Ubah Keranjang
                </button>
            </div>

            <div>
                {items.map((item) => {
                    const quantity = getQuantity(item);
                    const price = getPrice(item);

                    return (
                        <div
                            key={item.id}
                            className="px-4 sm:px-5 py-3 sm:py-4 border-b last:border-b-0 border-gray-100 dark:border-gray-800 flex gap-3 sm:gap-3.5"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img
                                    src={getImage(item)}
                                    alt={getName(item)}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                    {getName(item)}
                                </h3>

                                {item.namaVariant && (
                                    <span className="mt-0.5 inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] font-medium text-gray-600 dark:text-gray-300 rounded">
                                        {item.namaVariant}
                                    </span>
                                )}

                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    {getWeight(item) && (
                                        <span className="text-[11px] text-gray-400">
                                            {getWeight(item)} gram
                                        </span>
                                    )}

                                    {item.produk?.karatEmas && (
                                        <>
                                            <span className="text-gray-300">•</span>

                                            <span className="text-[11px] text-gray-400">
                                                {item.produk.karatEmas}K
                                            </span>
                                        </>
                                    )}
                                </div>

                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    {quantity} × {formatPrice(price)}
                                </p>
                            </div>

                            <div className="text-right shrink-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {formatPrice(price * quantity)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
