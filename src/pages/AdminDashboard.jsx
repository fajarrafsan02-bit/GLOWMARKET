import AdminLayout from "../components/AdminLayout.jsx";
import { TrendingUp, ShoppingBag, Users, Package, BarChart3, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import api from "../api/Axios.jsx";

export default function AdminDashboard() {
    // State untuk menyimpan statistik dashboard
    console.log(motion);
    const [stats, setStats] = useState([
        {
            icon: TrendingUp,
            value: "Rp 0",
            label: "Total Penjualan Bulan Ini",
            change: "",
            bgLight: "bg-yellow-50 dark:bg-yellow-900/20"
        },
        {
            icon: ShoppingBag,
            value: "0",
            label: "Pesanan Baru",
            change: "",
            bgLight: "bg-yellow-50 dark:bg-yellow-900/20"
        },
        {
            icon: Users,
            value: "0",
            label: "Total Pelanggan",
            change: "",
            bgLight: "bg-yellow-50 dark:bg-yellow-900/20"
        },
        {
            icon: Package,
            value: "0",
            label: "Produk Terjual",
            change: "",
            bgLight: "bg-yellow-50 dark:bg-yellow-900/20"
        }
    ]);

    const chartCanvasRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [chartReady, setChartReady] = useState(false);
    const [labels, setLabels] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);

    // Load Chart.js script secara dinamis
    useEffect(() => {
        // Cek apakah Chart.js sudah tersedia di global window
        if (window.Chart) {
            // Defer state update ke event loop berikutnya untuk menghindari cascading renders
            setTimeout(() => setChartReady(true), 0);
            return;
        }

        // Cek apakah script sudah pernah di-inject sebelumnya
        const scriptId = "chartjs-cdn-script";
        if (document.getElementById(scriptId)) {
            const existing = document.getElementById(scriptId);
            // Tambahkan listener jika script belum selesai dimuat
            if (!existing.dataset.loaded) {
                existing.addEventListener("load", () => {
                    existing.dataset.loaded = "true";
                    setTimeout(() => setChartReady(true), 0);
                }, { once: true });
            } else {
                setTimeout(() => setChartReady(true), 0);
            }
            return;
        }

        // Inject Chart.js script dari CDN
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js";
        script.async = true;
        script.onload = () => {
            script.dataset.loaded = "true";
            setTimeout(() => setChartReady(true), 0);
        };
        document.body.appendChild(script);
    }, []);

    // Render Chart ketika data dan library siap
    useEffect(() => {
        if (!chartReady || !chartCanvasRef.current || !window.Chart) return;
        if (!labels.length || !salesData.length || !productData.length) return;

        const ctx = chartCanvasRef.current.getContext("2d");

        // Gradient emas untuk penjualan
        const gradientGold = ctx.createLinearGradient(0, 0, 0, 400);
        gradientGold.addColorStop(0, "rgba(251, 191, 36, 0.9)");   // amber-400
        gradientGold.addColorStop(1, "rgba(245, 158, 11, 0.7)");   // amber-600

        // Gradient hijau untuk produk
        const gradientGreen = ctx.createLinearGradient(0, 0, 0, 400);
        gradientGreen.addColorStop(0, "rgba(34, 197, 94, 0.8)");
        gradientGreen.addColorStop(1, "rgba(22, 163, 74, 0.6)");

        // Hancurkan instance chart lama jika ada sebelum membuat yang baru
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new window.Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Total Penjualan (Rp)",
                        data: salesData,
                        backgroundColor: gradientGold,
                        borderColor: "rgb(245, 158, 11)",
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                        yAxisID: "y",
                    },
                    {
                        label: "Produk Terjual",
                        data: productData,
                        backgroundColor: gradientGreen,
                        borderColor: "rgb(22, 163, 74)",
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                        yAxisID: "y1",
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: {
                    legend: {
                        position: "top",
                        labels: { font: { size: 14 }, padding: 20, usePointStyle: true }
                    },
                    tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        titleFont: { size: 14 },
                        bodyFont: { size: 13 },
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            label: (context) => {
                                const label = context.dataset.label || "";
                                const value = context.parsed.y;
                                if (context.datasetIndex === 0) {
                                    return `${label}: ${new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        maximumFractionDigits: 0
                                    }).format(value)}`;
                                }
                                return `${label}: ${value} unit`;
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 13 } } },
                    y: {
                        type: "linear",
                        position: "left",
                        grid: { color: "rgba(156, 163, 175, 0.15)" },
                        ticks: {
                            callback: (value) => new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                notation: "compact",
                                maximumFractionDigits: 0
                            }).format(value),
                            font: { size: 12 }
                        },
                        title: { display: true, text: "Penjualan (Rp)", font: { size: 14, weight: "bold" } }
                    },
                    y1: {
                        type: "linear",
                        position: "right",
                        grid: { drawOnChartArea: false },
                        ticks: { font: { size: 12 } },
                        title: { display: true, text: "Jumlah Produk", font: { size: 14, weight: "bold" } }
                    }
                },
                animation: { duration: 1500, easing: "easeOutQuart" }
            }
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [chartReady, labels, salesData, productData]);

    // Fetch Semua Data Dashboard
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("admin_token");
            const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const year = new Date().getFullYear();

            // 1. Fetch Grafik Data
            try {
                let res;
                try {
                    res = await api.get("/api/statistik/grafik/12-bulan", headers);
                } catch (err) {
                    console.warn("[Dashboard] Endpoint /grafik/12-bulan tidak tersedia, mencoba endpoint alternatif:", err.message);
                    try {
                        res = await api.get("/api/statistik/grafik/penjualan-12-bulan", headers);
                    } catch (err2) {
                        console.warn("[Dashboard] Endpoint /grafik/penjualan-12-bulan tidak tersedia, fallback ke endpoint bulanan:", err2.message);
                        res = await api.get(`/api/statistik/grafik/bulanan?tahun=${year}`, headers);
                    }
                }
                const arr = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
                const sorted = arr
                    .filter(x => typeof x?.bulan === "number")
                    .sort((a, b) => Number(a.bulan) - Number(b.bulan));
                const lbls = sorted.map(x => x.namaBulan || new Date((x.tahun || year), x.bulan - 1, 1).toLocaleString("id-ID", { month: "long" }));
                const sales = sorted.map(x => (typeof x.totalPenjualan === "number" ? x.totalPenjualan : Number(x.totalPenjualan || 0)));
                const products = sorted.map(x => (typeof x.totalProdukTerjual === "number" ? x.totalProdukTerjual : Number(x.totalProdukTerjual || 0)));
                setLabels(lbls);
                setSalesData(sales);
                setProductData(products);
            } catch (error) {
                console.error("[Dashboard] Gagal mengambil data grafik:", error);
                console.error("[Dashboard] Error details:", error.response?.data || error.message);
                // Set empty arrays sebagai fallback
                setLabels([]);
                setSalesData([]);
                setProductData([]);
            }

            // 2. Fetch Total Pelanggan
            try {
                const res = await api.get("/api/user/total-pelanggan", headers);
                const raw = res?.data?.data ?? res?.data;
                const count = typeof raw === "number" ? raw : (raw?.total ?? raw?.count ?? 0);

                setStats(prev => prev.map(s => s.label === "Total Pelanggan" ? { ...s, value: String(count) } : s));
            } catch (error) {
                console.warn("[Dashboard] Gagal mengambil total pelanggan:", error.message);
                console.error("[Dashboard] Error response:", error.response?.data);
                // Set value ke 0 jika gagal
                setStats(prev => prev.map(s => s.label === "Total Pelanggan" ? { ...s, value: "0" } : s));
            }

            // 3. Fetch Statistik Bulan Ini (Penjualan, Produk, Pesanan)
            try {
                // Penjualan
                try {
                    const penRes = await api.get("/api/statistik/penjualan/bulan-ini", headers);
                    const pen = penRes?.data?.data ?? penRes?.data;
                    const totalPenjualan = pen?.totalPenjualan ?? 0;
                    const persen = pen?.persenPenjualan ?? 0;
                    const currency = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalPenjualan);
                    const change = persen ? `${persen > 0 ? "+" : ""}${Math.round(persen * 10) / 10}%` : "";
                    setStats(prev => prev.map(s => s.label === "Total Penjualan Bulan Ini" ? { ...s, value: currency, change } : s));
                } catch (err) {
                    console.warn("[Dashboard] Gagal mengambil data penjualan bulan ini:", err.message);
                    setStats(prev => prev.map(s => s.label === "Total Penjualan Bulan Ini" ? { ...s, value: "Rp 0", change: "" } : s));
                }

                // Produk Terjual
                try {
                    const prodRes = await api.get("/api/statistik/produk-terjual/bulan-ini", headers);
                    const prod = prodRes?.data?.data ?? prodRes?.data;
                    const total = prod?.totalJenisProduk ?? 0;
                    const persen = prod?.persenProduk ?? 0;
                    const change = persen ? `${persen > 0 ? "+" : ""}${Math.round(persen * 10) / 10}%` : "";
                    setStats(prev => prev.map(s => s.label === "Produk Terjual" ? { ...s, value: String(total), change } : s));
                } catch (err) {
                    console.warn("[Dashboard] Gagal mengambil data produk terjual bulan ini:", err.message);
                    setStats(prev => prev.map(s => s.label === "Produk Terjual" ? { ...s, value: "0", change: "" } : s));
                }

                // Pesanan Baru
                try {
                    const ordRes = await api.get("/api/statistik/pesanan/bulan-ini", headers);
                    const ord = ordRes?.data?.data ?? ordRes?.data;
                    const total = ord?.totalPesanan ?? 0;
                    const persen = ord?.persenPesanan ?? 0;
                    const change = persen ? `${persen > 0 ? "+" : ""}${Math.round(persen * 10) / 10}%` : "";
                    setStats(prev => prev.map(s => s.label === "Pesanan Baru" ? { ...s, value: String(total), change } : s));
                } catch (err) {
                    console.warn("[Dashboard] Gagal mengambil data pesanan baru bulan ini:", err.message);
                    setStats(prev => prev.map(s => s.label === "Pesanan Baru" ? { ...s, value: "0", change: "" } : s));
                }

            } catch (error) {
                console.error("[Dashboard] Gagal mengambil statistik bulan ini:", error);
                console.error("[Dashboard] Error details:", error.response?.data || error.message);
            }

            // 4. Fetch Produk Terlaris
            try {
                const res = await api.get("/api/terjual-produk", headers);
                const arr = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
                const sorted = arr
                    .slice()
                    .sort((a, b) => (b?.terjual || 0) - (a?.terjual || 0))
                    .slice(0, 5)
                    .map((p, idx) => ({
                        rank: idx + 1,
                        name: p.namaProduk || `Produk ${p.produkId || ""}`,
                        price: typeof p.harga === "number" ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p.harga) : (p.harga || "-"),
                        sales: Number(p.terjual || 0),
                        karat: p.karatEmas || ""
                    }));
                setBestSellingProducts(sorted);
            } catch (error) {
                console.warn("[Dashboard] Gagal mengambil produk terlaris:", error.message);
                console.error("[Dashboard] Error response:", error.response?.data);
                // Set empty array sebagai fallback
                setBestSellingProducts([]);
            }
        };

        fetchData();

        // Auto refresh setiap 30 detik
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AdminLayout title="Dashboard" activeMenu="dashboard">
            <div className="p-4 md:p-6 lg:p-8">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -4 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`${stat.bgLight} p-3 rounded-xl`}>
                                    <stat.icon className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                {stat.change && (
                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                        {stat.change}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                {stat.value}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Grafik + Produk Terlaris */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Grafik Penjualan */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                            <BarChart3 className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            Grafik Penjualan & Produk Terjual (12 Bulan Terakhir)
                        </h2>
                        <div className="h-80 md:h-96 relative">
                            <canvas ref={chartCanvasRef} />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                            Data diupdate secara real-time • Sumber: Statistik internal
                        </p>
                    </motion.div>

                    {/* Produk Terlaris */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-3">
                            <Flame className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                            Produk Terlaris
                        </h2>
                        <div className="space-y-3">
                            {bestSellingProducts.length === 0 ? (
                                <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
                                    Belum ada data produk terlaris
                                </p>
                            ) : (
                                bestSellingProducts.map((product, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        whileHover={{ x: 6 }}
                                        className="flex items-center gap-4 p-4 bg-linear-to-r from-yellow-50/80 to-amber-50/80 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700/30 hover:shadow-md transition-all"
                                    >
                                        <div className="w-10 h-10 bg-linear-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow">
                                            {product.rank}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {product.sales} terjual {product.karat && `• ${product.karat}`}
                                            </p>
                                        </div>
                                        <p className="text-sm font-bold text-amber-600 dark:text-yellow-400 whitespace-nowrap">
                                            {product.price}
                                        </p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </AdminLayout>
    );
}
