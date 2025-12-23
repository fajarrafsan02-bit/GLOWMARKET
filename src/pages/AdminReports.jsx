import { useEffect, useState, useRef } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import api from "../api/Axios.jsx";
import { Download, Calendar, TrendingUp, ShoppingBag, Users, Package } from "lucide-react";

export default function AdminReports() {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        newCustomers: 0,
        productsSold: 0,
        salesChange: "",
        ordersChange: "",
        productsChange: "",
    });
    const [loading, setLoading] = useState(true);
    const [chartReady, setChartReady] = useState(false);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const [monthlyData, setMonthlyData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [dailyReports, setDailyReports] = useState([]);
    const [reportStartDate, setReportStartDate] = useState(() => {
        // Default: 7 hari terakhir
        const date = new Date();
        date.setDate(date.getDate() - 6);
        return date.toISOString().split('T')[0];
    });
    const [reportEndDate, setReportEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [loadingReport, setLoadingReport] = useState(false);
    console.log(setSelectedYear)

    useEffect(() => {
        // Load Chart.js
        if (window.Chart) {
            setChartReady(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/chart.js";
        script.async = true;
        script.onload = () => setChartReady(true);
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        const fetchChartData = async () => {
            const token = localStorage.getItem("admin_token");
            const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            try {
                const response = await api.get(`/api/statistik/grafik/bulanan?tahun=${selectedYear}`, headers);
                const data = response?.data?.data || [];

                const formattedData = data.map(item => ({
                    month: item.namaBulan.substring(0, 3), // Ambil 3 huruf pertama nama bulan
                    sales: item.totalPenjualan,
                    products: item.totalProdukTerjual
                }));

                // Jika data kosong, gunakan array kosong atau inisialisasi default
                if (formattedData.length > 0) {
                    setMonthlyData(formattedData);
                } else {
                    // Fallback jika API belum ada data, untuk menghindari chart error
                    setMonthlyData([]);
                }
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };

        fetchChartData();
    }, [selectedYear]);

    useEffect(() => {
        if (!chartReady || !chartRef.current || monthlyData.length === 0) return;

        const ctx = chartRef.current.getContext("2d");

        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, "rgba(251, 146, 60, 0.8)");
        gradient.addColorStop(1, "rgba(251, 146, 60, 0.3)");

        if (chartInstance.current) chartInstance.current.destroy();

        chartInstance.current = new window.Chart(ctx, {
            type: "bar",
            data: {
                labels: monthlyData.map(d => d.month),
                datasets: [
                    {
                        label: "Penjualan (Rp)",
                        data: monthlyData.map(d => d.sales),
                        backgroundColor: gradient,
                        borderColor: "#fb923c",
                        borderWidth: 2,
                        borderRadius: 6,
                        yAxisID: "y",
                    },
                    {
                        label: "Produk Terjual",
                        data: monthlyData.map(d => d.products),
                        type: "line",
                        borderColor: "#10b981",
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        borderWidth: 3,
                        pointBackgroundColor: "#10b981",
                        tension: 0.4,
                        yAxisID: "y1",
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: {
                    legend: { position: "top", labels: { font: { size: 12 } } },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                if (context.datasetIndex === 0) {
                                    return `Penjualan: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(context.parsed.y)}`;
                                }
                                return `Produk Terjual: ${context.parsed.y}`;
                            },
                        },
                    },
                },
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        type: "linear",
                        position: "left",
                        ticks: {
                            callback: (value) => `Rp ${value / 1_000_000}jt`,
                        },
                    },
                    y1: {
                        type: "linear",
                        position: "right",
                        grid: { drawOnChartArea: false },
                        ticks: { callback: (value) => `${value}` },
                    },
                },
            },
        });

        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [chartReady, monthlyData]);

    // Fetch stats dari API (sama seperti AdminDashboard)
    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const fetchStats = async () => {
            try {
                setLoading(true);

                // Fetch Total Penjualan Bulan Ini
                try {
                    const penRes = await api.get("/api/statistik/penjualan/bulan-ini", headers);
                    const pen = penRes?.data?.data ?? penRes?.data;
                    const totalPenjualan = pen?.totalPenjualan ?? 0;
                    const persen = pen?.persenPenjualan ?? 0;
                    const change = persen ? `${persen > 0 ? "+" : ""}${Math.round(persen * 10) / 10}%` : "";
                    setStats(prev => ({ ...prev, totalSales: totalPenjualan, salesChange: change }));
                } catch (error) {
                    // Hanya log jika diperlukan untuk debugging, tidak mengganggu UI
                    console.debug("Gagal mengambil data penjualan bulan ini", error);
                }

                // Fetch Jumlah Pesanan Bulan Ini
                try {
                    const ordRes = await api.get("/api/statistik/pesanan/bulan-ini", headers);
                    const ord = ordRes?.data?.data ?? ordRes?.data;
                    const totalPesanan = ord?.totalPesanan ?? 0;
                    const persen = ord?.persenPesanan ?? 0;
                    const change = persen ? `${persen > 0 ? "+" : ""}${Math.round(persen * 10) / 10}%` : "";
                    setStats(prev => ({ ...prev, totalOrders: totalPesanan, ordersChange: change }));
                } catch (error) {
                    console.debug("Gagal mengambil data pesanan bulan ini", error);
                }

                // Fetch Total Pelanggan (Pelanggan Baru)
                try {
                    const custRes = await api.get("/api/user/total-pelanggan", headers);
                    const raw = custRes?.data?.data ?? custRes?.data;
                    const count = typeof raw === "number" ? raw : (raw?.total ?? raw?.count ?? 0);
                    setStats(prev => ({ ...prev, newCustomers: count }));
                } catch (error) {
                    console.debug("Gagal mengambil data total pelanggan", error);
                }

                // Fetch Produk Terjual Bulan Ini
                try {
                    const prodRes = await api.get("/api/statistik/produk-terjual/bulan-ini", headers);
                    const prod = prodRes?.data?.data ?? prodRes?.data;
                    const total = prod?.totalJenisProduk ?? 0;
                    const persen = prod?.persenProduk ?? 0;
                    const change = persen ? `${persen > 0 ? "+" : ""}${Math.round(persen * 10) / 10}%` : "";
                    setStats(prev => ({ ...prev, productsSold: total, productsChange: change }));
                } catch (error) {
                    console.debug("Gagal mengambil data produk terjual bulan ini", error);
                }

            } catch (error) {
                console.error("Gagal mengambil statistik umum", error);
                setStats({
                    totalSales: 0,
                    totalOrders: 0,
                    newCustomers: 0,
                    productsSold: 0,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Fetch laporan harian
    useEffect(() => {
        const fetchLaporanHarian = async () => {
            const token = localStorage.getItem("admin_token");
            const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            try {
                setLoadingReport(true);
                const response = await api.get(
                    `/api/statistik/laporan-harian?startDate=${reportStartDate}&endDate=${reportEndDate}`,
                    headers
                );

                const data = response?.data?.data || [];
                // Sort by date descending (newest first)
                const sortedData = data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
                setDailyReports(sortedData);
            } catch (error) {
                console.error("Error fetching daily report:", error);
                setDailyReports([]);
            } finally {
                setLoadingReport(false);
            }
        };

        fetchLaporanHarian();
    }, [reportStartDate, reportEndDate]);

    const formatPrice = (val) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    // const handleDateChange = () => {
    //     // Trigger re-fetch by updating state (already handled by useEffect dependency)
    // };

    const handleExportExcel = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await api.get(`/api/statistik/grafik/tahunan/export-excel?tahun=${selectedYear}`, {
                headers,
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Grafik_Penjualan_Tahunan_${selectedYear}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error exporting Excel:", error);
            alert("Gagal mengunduh laporan Excel");
        }
    };

    // Variabel loading digunakan untuk menampilkan spinner saat data awal diambil
    if (loading && !stats.totalSales) {
        // Opsional: Tampilkan loading state jika diperlukan
        // return <div className="p-8 text-center">Memuat data...</div>;
    }

    return (
        <AdminLayout title="Laporan" activeMenu="reports">
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            Laporan Penjualan
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Analisis performa bisnis Fajar Gold
                        </p>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { icon: TrendingUp, label: "Total Penjualan Bulan Ini", value: formatPrice(stats.totalSales), change: stats.salesChange },
                            { icon: ShoppingBag, label: "Pesanan Bulan Ini", value: stats.totalOrders, change: stats.ordersChange },
                            { icon: Users, label: "Total Pelanggan", value: stats.newCustomers, change: "" },
                            { icon: Package, label: "Produk Terjual Bulan Ini", value: stats.productsSold, change: stats.productsChange },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                        <stat.icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    {stat.change && (
                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                            {stat.change}
                                        </span>
                                    )}
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Grafik Penjualan Tahun 2025
                            </h2>
                            <button
                                onClick={handleExportExcel}
                                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium flex items-center gap-2 transition"
                            >
                                <Download className="w-4 h-4" />
                                Export Excel
                            </button>
                        </div>
                        <div className="h-96">
                            <canvas ref={chartRef} />
                        </div>
                    </div>

                    {/* Tabel Laporan Harian */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Header Section */}
                        <div className="px-6 py-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                {/* Title */}
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Laporan Harian
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Monitor transaksi dan pendapatan harian
                                    </p>
                                </div>

                                {/* Date Filters */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                                    {/* Start Date */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            Tanggal Mulai
                                        </label>
                                        <div className="relative">
                                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <input
                                                type="date"
                                                value={reportStartDate}
                                                onChange={(e) => setReportStartDate(e.target.value)}
                                                max={reportEndDate}
                                                className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Separator */}
                                    <div className="hidden sm:flex items-center pb-2.5">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>

                                    {/* End Date */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            Tanggal Akhir
                                        </label>
                                        <div className="relative">
                                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <input
                                                type="date"
                                                value={reportEndDate}
                                                onChange={(e) => setReportEndDate(e.target.value)}
                                                min={reportStartDate}
                                                max={new Date().toISOString().split('T')[0]}
                                                className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Filter Button */}
                                    <button
                                        type="button"
                                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                        Filter
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Table Content */}
                        <div className="overflow-x-auto">
                        {loadingReport ? (
                            <div className="px-6 py-12 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-600 dark:border-amber-500 border-t-transparent mx-auto mb-3" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">Memuat laporan...</p>
                            </div>
                        ) : dailyReports.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-600 dark:text-gray-400">Tidak ada data untuk periode yang dipilih</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pesanan</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Penjualan</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produk Terjual</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {dailyReports.map((report, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                            <td className="px-6 py-4 text-gray-900 dark:text-gray-200 font-medium">
                                                {formatDate(report.tanggal)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
                                                    {report.pesanan || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-900 dark:text-gray-100 font-semibold">
                                                {formatPrice(report.penjualan || 0)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                                                    {report.produkTerjual || 0}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr className="font-bold">
                                        <td className="px-6 py-4 text-gray-900 dark:text-white">
                                            Total
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                                            {dailyReports.reduce((sum, r) => sum + (r.pesanan || 0), 0)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-amber-600 dark:text-amber-400">
                                            {formatPrice(dailyReports.reduce((sum, r) => sum + (r.penjualan || 0), 0))}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                                            {dailyReports.reduce((sum, r) => sum + (r.produkTerjual || 0), 0)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        )}
                        </div>
                    </div>
                </div>
            </div>
            {/* </div> */}
        </AdminLayout>
    );
}