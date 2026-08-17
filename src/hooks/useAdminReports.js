import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/Axios.jsx";
import { toMoney } from "../utils/format.js";

function formatChange(percentage) {
    const value = Number(percentage) || 0;

    if (value === 0) {
        return "";
    }

    return `${value > 0 ? "+" : ""}${Math.round(value * 10) / 10}%`;
}

export default function useAdminReports() {
    const currentYear = new Date().getFullYear();

    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        newCustomers: 0,
        productsSold: 0,
        salesChange: "",
        ordersChange: "",
        productsChange: "",
    });

    const [monthlyData, setMonthlyData] = useState([]);

    const [dailyReports, setDailyReports] = useState([]);

    const [chartReady, setChartReady] = useState(
        () => typeof window !== "undefined" && !!window.Chart,
    );

    const [reportStartDate, setReportStartDate] = useState(() => {
        const date = new Date();

        date.setDate(date.getDate() - 6);

        return date.toISOString().split("T")[0];
    });

    const [reportEndDate, setReportEndDate] = useState(
        () => new Date().toISOString().split("T")[0],
    );

    const [loadingReport, setLoadingReport] = useState(false);

    const [loadingStats, setLoadingStats] = useState(false);

    /* ============================================================
       LOAD CHART.JS
    ============================================================ */

    useEffect(() => {
        if (window.Chart) {
            setChartReady(true);
            return;
        }

        const scriptId = "admin-chartjs";

        const existingScript = document.getElementById(scriptId);

        if (existingScript) {
            existingScript.addEventListener("load", () => setChartReady(true), { once: true });

            return;
        }

        const script = document.createElement("script");

        script.id = scriptId;
        script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js";
        script.async = true;

        script.onload = () => setChartReady(true);

        script.onerror = () => console.error("Gagal memuat Chart.js");

        document.body.appendChild(script);
    }, []);

    /* ============================================================
       MONTHLY CHART
    ============================================================ */

    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                const response = await api.get(
                    `/api/statistik/grafik/bulanan?tahun=${currentYear}`,
                );

                const data = response?.data?.data || [];

                const formatted = data.map((item) => ({
                    month: item.namaBulan?.substring(0, 3) || "-",
                    sales: toMoney(item.totalPenjualan),
                    products: Number(item.totalProdukTerjual || 0),
                }));

                setMonthlyData(formatted);
            } catch (error) {
                console.error("[Reports] Monthly chart error:", error);

                setMonthlyData([]);
            }
        };

        fetchMonthlyData();
    }, [currentYear]);

    /* ============================================================
       GENERAL STATS
    ============================================================ */

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoadingStats(true);

                /* SALES */

                try {
                    const response = await api.get("/api/statistik/penjualan/bulan-ini");

                    const data = response?.data?.data ?? response?.data ?? {};

                    const total = toMoney(data.totalPenjualan);

                    const percentage = Number(data.persenPenjualan || 0);

                    setStats((prev) => ({
                        ...prev,
                        totalSales: total,
                        salesChange: formatChange(percentage),
                    }));
                } catch (error) {
                    console.debug("Gagal mengambil statistik penjualan:", error);
                }

                /* ORDERS */

                try {
                    const response = await api.get("/api/statistik/pesanan/bulan-ini");

                    const data = response?.data?.data ?? response?.data ?? {};

                    const total = Number(data.totalPesanan || 0);

                    const percentage = Number(data.persenPesanan || 0);

                    setStats((prev) => ({
                        ...prev,
                        totalOrders: total,
                        ordersChange: formatChange(percentage),
                    }));
                } catch (error) {
                    console.debug("Gagal mengambil statistik pesanan:", error);
                }

                /* CUSTOMERS */

                try {
                    const response = await api.get("/api/user/total-pelanggan");

                    const raw = response?.data?.data ?? response?.data ?? 0;

                    const count =
                        typeof raw === "number" ? raw : Number(raw?.total ?? raw?.count ?? 0);

                    setStats((prev) => ({
                        ...prev,
                        newCustomers: count,
                    }));
                } catch (error) {
                    console.debug("Gagal mengambil statistik pelanggan:", error);
                }

                /* PRODUCTS */

                try {
                    const response = await api.get("/api/statistik/produk-terjual/bulan-ini");

                    const data = response?.data?.data ?? response?.data ?? {};

                    const total = Number(data.totalJenisProduk || 0);

                    const percentage = Number(data.persenProduk || 0);

                    setStats((prev) => ({
                        ...prev,
                        productsSold: total,
                        productsChange: formatChange(percentage),
                    }));
                } catch (error) {
                    console.debug("Gagal mengambil statistik produk:", error);
                }
            } catch (error) {
                console.error("[Reports] Stats error:", error);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, []);

    /* ============================================================
       DAILY REPORT
    ============================================================ */

    const fetchDailyReport = useCallback(async () => {
        try {
            setLoadingReport(true);

            const response = await api.get(
                `/api/statistik/laporan-harian?startDate=${reportStartDate}&endDate=${reportEndDate}`,
            );

            const data = response?.data?.data || [];

            const sortedData = [...data].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

            setDailyReports(sortedData);
        } catch (error) {
            console.error("[Reports] Daily report error:", error);

            setDailyReports([]);
        } finally {
            setLoadingReport(false);
        }
    }, [reportStartDate, reportEndDate]);

    useEffect(() => {
        fetchDailyReport();
    }, [fetchDailyReport]);

    /* ============================================================
       SUMMARY
    ============================================================ */

    const reportSummary = useMemo(() => {
        const totalSales = dailyReports.reduce(
            (sum, item) => sum + toMoney(item.penjualan ?? item.totalPenjualan ?? item.totalSales),
            0,
        );

        const totalOrders = dailyReports.reduce(
            (sum, item) => sum + Number(item.totalPesanan || item.totalOrders || 0),
            0,
        );

        const totalProducts = dailyReports.reduce(
            (sum, item) => sum + Number(item.totalProdukTerjual || item.productsSold || 0),
            0,
        );

        return {
            totalSales,
            totalOrders,
            totalProducts,
        };
    }, [dailyReports]);

    /* ============================================================
       FORMATTERS
    ============================================================ */

    const formatPrice = useCallback(
        (value) =>
            new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
            }).format(Number(value) || 0),
        [],
    );

    const formatDate = useCallback((dateString) => {
        if (!dateString) return "-";

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }, []);

    /* ============================================================
       EXPORT
    ============================================================ */

    const handleExportExcel = useCallback(async () => {
        try {
            const response = await api.get(
                `/api/statistik/grafik/tahunan/export-excel?tahun=${currentYear}`,
                {
                    responseType: "blob",
                },
            );

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download = `Laporan_Penjualan_${currentYear}.xlsx`;

            document.body.appendChild(link);

            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("[Reports] Export error:", error);

            alert("Gagal mengunduh laporan Excel");
        }
    }, [currentYear]);

    return {
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
    };
}
