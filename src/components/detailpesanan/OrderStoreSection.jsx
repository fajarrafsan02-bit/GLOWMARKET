import { Link } from "react-router-dom";
import { MessageCircle, ShoppingBag, Truck } from "lucide-react";

import useStoreSettings from "../../hooks/useStoreSettings.js";
import OrderProductList from "./OrderProductList.jsx";

export default function OrderStoreSection({ items, totalItems, order, chatState }) {
    const store = useStoreSettings();

    return (
        <section className="mt-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-sm">
            <div className="px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {store.name}
                        </p>

                        <p className="text-[11px] text-gray-400">Toko Perhiasan & Emas</p>
                    </div>
                </div>

                <Link
                    to="/chat"
                    state={chatState}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-amber-400 hover:text-amber-600 transition"
                >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Chat Penjual
                </Link>
            </div>

            <OrderProductList items={items} totalItems={totalItems} />

            <div className="px-4 sm:px-5 py-4 bg-gray-50 dark:bg-gray-950/40 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-3">
                    <Truck className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />

                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Informasi Pengiriman
                            </p>

                            {order.resi && (
                                <span className="text-[11px] text-gray-400">
                                    Resi:{" "}
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {order.resi}
                                    </span>
                                </span>
                            )}
                        </div>

                        <p className="mt-1 text-[11px] text-gray-400">
                            Pesanan akan dikirim ke alamat penerima di bawah.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
