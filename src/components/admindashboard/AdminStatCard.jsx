import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import { formatPrice } from "../../utils/format.js";

export default function AdminStatCard({ stat, index }) {
    const Icon = stat.icon;

    const value = stat.value ?? stat.amount ?? stat.count ?? 0;

    const title =
        stat.title ??
        stat.label ??
        ["Pendapatan", "Pesanan", "Pelanggan", "Produk"][index] ??
        "Statistik";

    const change = stat.change ?? stat.percentage ?? null;

    const isPositive = stat.isPositive ?? !String(change || "").startsWith("-");

    const isCurrency =
        index === 0 ||
        title.toLowerCase().includes("pendapatan") ||
        title.toLowerCase().includes("revenue");

    const formattedValue = isCurrency
        ? typeof value === "string" && /rp/i.test(value)
            ? value
            : formatPrice(value)
        : new Intl.NumberFormat("id-ID").format(Number(value) || 0);

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                </div>

                {change !== null && (
                    <span
                        className={` inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"} `}
                    >
                        {isPositive ? (
                            <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        ) : (
                            <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        )}

                        {change}
                    </span>
                )}
            </div>

            <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{title}</p>

            <p className="mt-0.5 sm:mt-1 text-sm sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white break-words">
                {formattedValue}
            </p>

            {stat.description && (
                <p className="mt-1 text-[9px] sm:text-[10px] text-gray-400">{stat.description}</p>
            )}
        </div>
    );
}
