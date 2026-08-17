import { toMoney } from "../../utils/format.js";

import ReportHeader from "./daily/ReportHeader.jsx";
import PeriodSummary from "./daily/PeriodSummary.jsx";
import ReportTable from "./daily/ReportTable.jsx";
import ReportLoading from "./daily/ReportLoading.jsx";
import ReportEmpty from "./daily/ReportEmpty.jsx";

export default function DailyReportTable({
    reportStartDate,
    onStartDateChange,
    reportEndDate,
    onEndDateChange,
    loadingReport,
    dailyReports = [],
    formatPrice,
    formatDate,
}) {
    const totalOrders = dailyReports.reduce(
        (sum, report) =>
            sum + Number(report.pesanan ?? report.totalPesanan ?? report.totalOrders ?? 0),
        0,
    );

    const totalSales = dailyReports.reduce(
        (sum, report) =>
            sum + toMoney(report.penjualan ?? report.totalPenjualan ?? report.totalSales),
        0,
    );

    const totalProducts = dailyReports.reduce(
        (sum, report) =>
            sum +
            Number(report.produkTerjual ?? report.totalProdukTerjual ?? report.productsSold ?? 0),
        0,
    );

    const refresh = () => {
        if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("report:refresh"));
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <ReportHeader
                reportStartDate={reportStartDate}
                onStartDateChange={onStartDateChange}
                reportEndDate={reportEndDate}
                onEndDateChange={onEndDateChange}
                loadingReport={loadingReport}
                onRefresh={refresh}
            />

            <PeriodSummary
                hariTransaksi={dailyReports.length}
                totalOrders={totalOrders}
                totalSales={totalSales}
                totalProducts={totalProducts}
                formatPrice={formatPrice}
            />

            <div className="overflow-x-auto">
                {loadingReport ? (
                    <ReportLoading />
                ) : dailyReports.length === 0 ? (
                    <ReportEmpty />
                ) : (
                    <ReportTable
                        dailyReports={dailyReports}
                        formatPrice={formatPrice}
                        formatDate={formatDate}
                        totalOrders={totalOrders}
                        totalSales={totalSales}
                        totalProducts={totalProducts}
                    />
                )}
            </div>
        </div>
    );
}
