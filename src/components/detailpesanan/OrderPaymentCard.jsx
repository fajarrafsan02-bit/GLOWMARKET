import { CreditCard } from "lucide-react";

import { formatPrice } from "../../utils/format.js";

export default function OrderPaymentCard({
    totalItems,
    subtotal,
    ongkir,
    totalBayar,
    order,
    onHubungiPenjual,
    onBeliLagi,
    beliLagiLoading,
    beliLagiError,
}) {
    return (
        <section className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-sm">
            <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-500" />

                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Rincian Pembayaran
                    </h2>
                </div>
            </div>

            <div className="px-4 sm:px-5 py-4 space-y-3">
                <div className="flex justify-between gap-3 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                        Total Produk ({totalItems})
                    </span>

                    <span className="text-gray-800 dark:text-gray-200">
                        {formatPrice(subtotal)}
                    </span>
                </div>

                <div className="flex justify-between gap-3 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                        {order?.ongkirKurir
                            ? `Ongkos Kirim (${order.ongkirKurir.toUpperCase()}${order.ongkirLayanan ? ` - ${order.ongkirLayanan.toUpperCase()}` : ""})`
                            : "Ongkos Kirim"}
                    </span>

                    {ongkir > 0 ? (
                        <span className="text-gray-800 dark:text-gray-200">
                            {formatPrice(ongkir)}
                        </span>
                    ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Gratis
                        </span>
                    )}
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-end justify-between gap-3">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Total Pembayaran
                    </span>

                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                        {formatPrice(totalBayar)}
                    </span>
                </div>
            </div>

            <div className="px-4 sm:px-5 pb-4 flex flex-col sm:flex-row lg:flex-col gap-2">
                <button
                    type="button"
                    onClick={onBeliLagi}
                    disabled={beliLagiLoading}
                    className="h-9 px-4 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition disabled:opacity-50"
                >
                    {beliLagiLoading ? "Menambahkan..." : "Beli Lagi"}
                </button>

                <button
                    type="button"
                    onClick={onHubungiPenjual}
                    className="h-9 px-4 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                    Hubungi Penjual
                </button>

                {beliLagiError && (
                    <p className="text-[11px] text-red-600 dark:text-red-400">{beliLagiError}</p>
                )}
            </div>
        </section>
    );
}
