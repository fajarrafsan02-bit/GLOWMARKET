export default function PeriodSummary({
    hariTransaksi,
    totalOrders,
    totalSales,
    totalProducts,
    formatPrice,
}) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
            <div className="px-3 sm:px-6 py-2.5 sm:py-3.5 border-b sm:border-b-0 border-r sm:border-r-0 border-gray-100 dark:border-gray-800">
                <p className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 font-semibold truncate">
                    RINGKASAN PERIODE
                </p>

                <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {hariTransaksi} Hari
                </p>
            </div>

            <div className="px-3 sm:px-6 py-2.5 sm:py-3.5 text-left sm:text-center border-b sm:border-b-0 sm:border-l border-gray-100 dark:border-gray-800">
                <p className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    PESANAN
                </p>

                <p className="mt-0.5 sm:mt-1 text-[13px] sm:text-sm font-bold text-gray-900 dark:text-white">
                    {totalOrders}
                </p>
            </div>

            <div className="px-3 sm:px-6 py-2.5 sm:py-3.5 text-left sm:text-right border-r sm:border-r-0 sm:border-l border-gray-100 dark:border-gray-800">
                <p className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    PENJUALAN
                </p>

                <p className="mt-0.5 sm:mt-1 text-[13px] sm:text-sm font-bold text-amber-600 dark:text-amber-400 truncate">
                    {formatPrice(totalSales)}
                </p>
            </div>

            <div className="px-3 sm:px-6 py-2.5 sm:py-3.5 text-left sm:text-center sm:border-l border-gray-100 dark:border-gray-800">
                <p className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 font-semibold truncate">
                    PRODUK TERJUAL
                </p>

                <p className="mt-0.5 sm:mt-1 text-[13px] sm:text-sm font-bold text-gray-900 dark:text-white">
                    {totalProducts}
                </p>
            </div>
        </div>
    );
}
