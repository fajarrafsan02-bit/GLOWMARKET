import { BarChart3, Download, TrendingUp } from "lucide-react";

import useReportSalesChart from "../../hooks/useReportSalesChart.js";

export default function ReportSalesChart({
    monthlyData = [],
    chartReady: externalChartReady,
    onExport,
    currentYear = new Date().getFullYear(),
}) {
    const { canvasRef, isChartReady } = useReportSalesChart({
        monthlyData,
        externalChartReady,
    });

    return (
        <div className="w-full">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                        <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                    </div>

                    <div>
                        <h3 className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white">
                            Penjualan Bulanan
                        </h3>

                        <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">
                            Omzet dan produk terjual tahun {currentYear}
                        </p>
                    </div>
                </div>

                {onExport && (
                    <button
                        type="button"
                        onClick={onExport}
                        className="h-7 sm:h-8 px-2 sm:px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-600 dark:hover:text-amber-400 text-[9px] sm:text-[10px] font-semibold flex items-center gap-1.5 transition shrink-0"
                    >
                        <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Export
                    </button>
                )}
            </div>

            {/* CHART */}
            <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[360px]">
                {!isChartReady ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-pulse mb-2" />

                        <span className="text-[11px] sm:text-xs text-gray-400">Memuat grafik...</span>
                    </div>
                ) : (
                    <canvas ref={canvasRef} />
                )}
            </div>

            {/* FOOTER */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                <span className="text-[10px] text-gray-400">Sumber: statistik internal</span>

                <span className="inline-flex items-center gap-1.5 text-[10px] text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Data tersedia
                </span>
            </div>
        </div>
    );
}
