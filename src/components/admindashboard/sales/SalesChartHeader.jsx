import { BarChart3 } from "lucide-react";

import { formatPrice } from "../../../utils/format.js";

export default function SalesChartHeader({ totalSales, totalUnits }) {
    return (
        <div className="px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Penjualan
                        </h2>

                        <p className="mt-0.5 text-[10px] text-gray-400">
                            Performa 12 bulan terakhir
                        </p>
                    </div>
                </div>

                {/* Summary */}
                <div className="flex items-center gap-4 sm:gap-5">
                    <div>
                        <p className="text-[9px] uppercase tracking-wider text-gray-400">
                            Total Penjualan
                        </p>

                        <p className="mt-0.5 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                            {formatPrice(totalSales)}
                        </p>
                    </div>

                    <div className="w-px h-7 bg-gray-200 dark:bg-gray-800" />

                    <div>
                        <p className="text-[9px] uppercase tracking-wider text-gray-400">
                            Unit Terjual
                        </p>

                        <p className="mt-0.5 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                            {new Intl.NumberFormat("id-ID").format(totalUnits)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
