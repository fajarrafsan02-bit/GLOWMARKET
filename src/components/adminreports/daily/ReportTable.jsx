export default function ReportTable({
    dailyReports,
    formatPrice,
    formatDate,
    totalOrders,
    totalSales,
    totalProducts,
}) {
    return (
        <table className="w-full table-fixed min-w-[500px] sm:min-w-[640px]">
            <colgroup>
                <col className="w-[30%]" />
                <col className="w-[20%]" />
                <col className="w-[30%]" />
                <col className="w-[20%]" />
            </colgroup>

            <thead>
                <tr className="bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    <th className="px-4 sm:px-6 py-3 sm:py-3.5 text-left text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Tanggal
                    </th>

                    <th className="px-4 sm:px-6 py-3 sm:py-3.5 text-center text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Pesanan
                    </th>

                    <th className="px-4 sm:px-6 py-3 sm:py-3.5 text-right text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Penjualan
                    </th>

                    <th className="px-4 sm:px-6 py-3 sm:py-3.5 text-center text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Produk Terjual
                    </th>
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {dailyReports.map((report, index) => {
                    const pesanan = report.pesanan ?? report.totalPesanan ?? report.totalOrders ?? 0;
                    const penjualan =
                        report.penjualan ?? report.totalPenjualan ?? report.totalSales ?? 0;
                    const produkTerjual =
                        report.produkTerjual ?? report.totalProdukTerjual ?? report.productsSold ?? 0;

                    return (
                        <tr
                            key={report.id || report.tanggal || index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                        >
                            {/* Date */}
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                                <div>
                                    <p className="text-[11px] sm:text-xs font-medium text-gray-800 dark:text-gray-200">
                                        {formatDate(report.tanggal)}
                                    </p>

                                    <p className="mt-0.5 text-[8px] sm:text-[9px] text-gray-400">
                                        {new Date(report.tanggal).toLocaleDateString("id-ID", {
                                            weekday: "short",
                                        })}
                                    </p>
                                </div>
                            </td>

                            {/* Orders */}
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                                <span className="inline-flex min-w-7 sm:min-w-8 justify-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[11px] sm:text-xs font-semibold text-blue-700 dark:text-blue-400">
                                    {pesanan}
                                </span>
                            </td>

                            {/* Sales */}
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                                <span className="text-[11px] sm:text-xs font-semibold text-gray-900 dark:text-white">
                                    {formatPrice(penjualan)}
                                </span>
                            </td>

                            {/* Products */}
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                                <span className="inline-flex min-w-7 sm:min-w-8 justify-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                    {produkTerjual}
                                </span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>

            <tfoot className="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <tr>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white">
                        Total
                    </td>

                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white">
                        {totalOrders}
                    </td>

                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right text-[11px] sm:text-xs font-bold text-amber-600 dark:text-amber-400">
                        {formatPrice(totalSales)}
                    </td>

                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white">
                        {totalProducts}
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}
