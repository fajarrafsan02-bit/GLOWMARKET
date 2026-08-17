import { DollarSign, ShoppingBag, Users, Package, TrendingUp, TrendingDown } from "lucide-react";

export default function ReportStatCards({ stats, formatPrice, loading = false }) {
    const cards = [
        {
            key: "sales",
            label: "Total Penjualan",
            value: formatPrice
                ? formatPrice(stats?.totalSales || 0)
                : `Rp ${stats?.totalSales || 0}`,
            change: stats?.salesChange || "",
            icon: DollarSign,
            accent: "amber",
        },
        {
            key: "orders",
            label: "Total Pesanan",
            value: stats?.totalOrders || 0,
            change: stats?.ordersChange || "",
            icon: ShoppingBag,
            accent: "blue",
        },
        {
            key: "customers",
            label: "Pelanggan Baru",
            value: stats?.newCustomers || 0,
            change: "",
            icon: Users,
            accent: "emerald",
        },
        {
            key: "products",
            label: "Produk Terjual",
            value: stats?.productsSold || 0,
            change: stats?.productsChange || "",
            icon: Package,
            accent: "purple",
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                {Array.from({
                    length: 4,
                }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-4 animate-pulse"
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-200 dark:bg-gray-800" />

                            <div className="w-10 h-3 rounded bg-gray-200 dark:bg-gray-800" />
                        </div>

                        <div className="mt-3 sm:mt-4 h-2.5 w-24 rounded bg-gray-200 dark:bg-gray-800" />

                        <div className="mt-1 sm:mt-2 h-6 w-28 rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {cards.map((card) => {
                const Icon = card.icon;

                const isPositive = String(card.change).startsWith("+");

                const isNegative = String(card.change).startsWith("-");

                const accent = getAccent(card.accent);

                return (
                    <div
                        key={card.key}
                        className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-4 overflow-hidden transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700"
                    >
                        {/* Accent line */}
                        <div className={` absolute left-0 top-0 bottom-0 w-0.5 ${accent.line} `} />

                        <div className="flex items-start justify-between gap-3">
                            {/* Icon */}
                            <div
                                className={` w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${accent.iconBg} `}
                            >
                                <Icon className={` w-3.5 h-3.5 sm:w-4 sm:h-4 ${accent.icon} `} />
                            </div>

                            {/* Change */}
                            {card.change && (
                                <div
                                    className={` inline-flex items-center gap-1 px-1.5 py-1 rounded-md text-[9px] font-semibold ${isPositive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : isNegative ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"} `}
                                >
                                    {isPositive && <TrendingUp className="w-2.5 h-2.5" />}

                                    {isNegative && <TrendingDown className="w-2.5 h-2.5" />}

                                    {!isPositive && !isNegative && (
                                        <span className="w-1 h-1 rounded-full bg-current" />
                                    )}

                                    {card.change}
                                </div>
                            )}
                        </div>

                        {/* Label */}
                        <p className="mt-3 sm:mt-4 text-[9px] sm:text-[10px] uppercase tracking-wider font-medium text-gray-400">
                            {card.label}
                        </p>

                        {/* Value */}
                        <p
                            className="mt-0.5 sm:mt-1 text-base sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate"
                            title={String(card.value)}
                        >
                            {card.value}
                        </p>

                        {/* Subtext */}
                        <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-[9px] text-gray-400">Bulan berjalan</p>
                    </div>
                );
            })}
        </div>
    );
}

function getAccent(type) {
    const accents = {
        amber: {
            line: "bg-amber-500",
            iconBg: "bg-amber-50 dark:bg-amber-900/20",
            icon: "text-amber-600 dark:text-amber-400",
        },

        blue: {
            line: "bg-blue-500",
            iconBg: "bg-blue-50 dark:bg-blue-900/20",
            icon: "text-blue-600 dark:text-blue-400",
        },

        emerald: {
            line: "bg-emerald-500",
            iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
            icon: "text-emerald-600 dark:text-emerald-400",
        },

        purple: {
            line: "bg-purple-500",
            iconBg: "bg-purple-50 dark:bg-purple-900/20",
            icon: "text-purple-600 dark:text-purple-400",
        },
    };

    return accents[type] || accents.amber;
}
