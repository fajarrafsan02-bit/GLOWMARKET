import {
    TrendingUp,
    ShoppingBag,
    Users,
    Package,
} from "lucide-react";

import AdminLayout from "../components/AdminLayout.jsx";

import useDashboardData from "../hooks/useDashboardData.js";

import SalesChart from "../components/admindashboard/SalesChart.jsx";
import BestSellingProducts from "../components/admindashboard/BestSellingProducts.jsx";
import AdminStatCard from "../components/admindashboard/AdminStatCard.jsx";
import OrderStatusCard from "../components/admindashboard/OrderStatusCard.jsx";
import LowStockCard from "../components/admindashboard/LowStockCard.jsx";
import QuickAction from "../components/admindashboard/QuickAction.jsx";

export default function AdminDashboard() {
    const {
        stats = [],
        labels = [],
        salesData = [],
        productData = [],
        bestSellingProducts = [],
        orderStatusCounts,
    } = useDashboardData();

    const statMeta = [
        {
            label: "Pendapatan",
            icon: TrendingUp,
        },
        {
            label: "Pesanan",
            icon: ShoppingBag,
        },
        {
            label: "Pelanggan",
            icon: Users,
        },
        {
            label: "Produk",
            icon: Package,
        },
    ];

    const normalizedStats = stats.map((stat, index) => ({
        ...stat,
        icon: stat.icon || statMeta[index]?.icon || Package,
    }));

    return (
        <AdminLayout title="Dashboard" activeMenu="dashboard">
            <div className="min-h-[calc(100vh-64px)] bg-[#f7f7f8] dark:bg-gray-950 p-4 sm:p-5 lg:p-6">
                {/* HEADER */}
                <div className="mb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                            Dashboard
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Pantau penjualan dan operasional toko Anda.
                        </p>
                    </div>

                    <div className="inline-flex items-center self-start lg:self-auto gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Toko online aktif
                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 mb-5">
                    {normalizedStats.map((stat, index) => (
                        <AdminStatCard key={stat.id ?? index} stat={stat} index={index} />
                    ))}
                </div>

                {/* ANALYTICS */}
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-4 mb-5">
                    <section className="min-w-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                        <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2.5 sm:gap-3">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Penjualan
                                </h2>

                                <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-400">
                                    Performa penjualan toko
                                </p>
                            </div>

                            <select
                                className="h-8 px-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 focus:outline-none"
                                defaultValue="30"
                            >
                                <option value="7">7 hari</option>

                                <option value="30">30 hari</option>

                                <option value="90">90 hari</option>
                            </select>
                        </div>

                        <div className="p-3 sm:p-5">
                            <SalesChart
                                labels={labels}
                                salesData={salesData}
                                productData={productData}
                            />
                        </div>
                    </section>

                    <OrderStatusCard orderStatusCounts={orderStatusCounts} />
                </div>

                {/* PRODUCTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                    <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                        <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Produk Terlaris
                                </h2>

                                <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-400">
                                    Produk dengan penjualan tertinggi
                                </p>
                            </div>

                            <button
                                type="button"
                                className="text-[11px] sm:text-xs font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
                            >
                                Lihat semua
                            </button>
                        </div>

                        <div className="p-0">
                            <BestSellingProducts products={bestSellingProducts} />
                        </div>
                    </section>

                    <LowStockCard products={bestSellingProducts} />
                </div>

                {/* QUICK ACTION */}
                <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Akses Cepat
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100 dark:bg-gray-800">
                        <QuickAction
                            icon={ShoppingBag}
                            label="Kelola Pesanan"
                            description="Cek pesanan terbaru"
                        />

                        <QuickAction
                            icon={Package}
                            label="Tambah Produk"
                            description="Masukkan produk baru"
                        />

                        <QuickAction
                            icon={Users}
                            label="Pelanggan"
                            description="Lihat data pelanggan"
                        />

                        <QuickAction
                            icon={TrendingUp}
                            label="Laporan"
                            description="Analisis penjualan"
                        />
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
