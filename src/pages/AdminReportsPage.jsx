import { BarChart3, Download, CalendarDays } from "lucide-react";

import AdminLayout from "../components/AdminLayout.jsx";
import useAdminReports from "../hooks/useAdminReports.js";

import ReportStatCards from "../components/adminreports/ReportStatCards.jsx";
import ReportSalesChart from "../components/adminreports/ReportSalesChart.jsx";
import DailyReportTable from "../components/adminreports/DailyReportTable.jsx";
import ReportSummaryCard from "../components/adminreports/ReportSummaryCard.jsx";

export default function AdminReports() {
    const {
        currentYear,
        stats,
        monthlyData,
        chartReady,
        reportStartDate,
        setReportStartDate,
        reportEndDate,
        setReportEndDate,
        loadingReport,
        loadingStats,
        reportSummary,
        dailyReports,
        formatPrice,
        formatDate,
        handleExportExcel,
    } = useAdminReports();

    return (
        <AdminLayout title="Laporan" activeMenu="reports">
            <main className="min-h-[calc(100vh-64px)] bg-[#f7f7f8] dark:bg-gray-950 p-3 sm:p-5 lg:p-6">
                {/* PAGE HEADER */}
                <div className="mb-4 sm:mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>

                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                                Laporan
                            </h1>
                        </div>

                        <p className="mt-1 text-[11px] sm:text-sm text-gray-500 dark:text-gray-400">
                            Analisis performa penjualan dan operasional toko.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="h-9 px-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                            <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                            Tahun <span className="font-semibold">{currentYear}</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleExportExcel}
                            className="h-9 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-semibold flex items-center gap-1.5 transition"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Export Excel
                        </button>
                    </div>
                </div>

                {/* KPI */}
                <div className="mb-4 sm:mb-5">
                    <ReportStatCards stats={stats} formatPrice={formatPrice} loading={loadingStats} />
                </div>

                {/* PERIOD SUMMARY */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <ReportSummaryCard
                        label="Penjualan Periode"
                        value={formatPrice(reportSummary.totalSales)}
                    />

                    <ReportSummaryCard label="Pesanan Periode" value={reportSummary.totalOrders} />

                    <ReportSummaryCard label="Produk Terjual" value={reportSummary.totalProducts} />
                </div>

                {/* CHART */}
                <section className="mb-4 sm:mb-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-3 sm:px-5 py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Tren Penjualan
                            </h2>

                            <p className="mt-0.5 text-[10px] text-gray-400">
                                Performa penjualan dan jumlah produk terjual sepanjang tahun.
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-1.5 text-[10px] text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Data tahun {currentYear}
                        </div>
                    </div>

                    <div className="p-3 sm:p-5">
                        <ReportSalesChart
                            chartReady={chartReady}
                            monthlyData={monthlyData}
                            currentYear={currentYear}
                            onExport={handleExportExcel}
                        />
                    </div>
                </section>

                {/* DAILY REPORT */}
                <DailyReportTable
                    reportStartDate={reportStartDate}
                    onStartDateChange={setReportStartDate}
                    reportEndDate={reportEndDate}
                    onEndDateChange={setReportEndDate}
                    loadingReport={loadingReport}
                    dailyReports={dailyReports}
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                />
            </main>
        </AdminLayout>
    );
}
