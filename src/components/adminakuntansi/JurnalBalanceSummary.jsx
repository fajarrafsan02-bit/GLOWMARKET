import { AlertTriangle, ArrowDownLeft, ArrowUpRight, Scale } from "lucide-react";

import { formatPrice } from "../../utils/format.js";

/**
 * Ringkasan total Debit vs Kredit seluruh jurnal yang tampil — harus selalu
 * sama besar (balance) karena setiap jurnal dicatat dengan double entry.
 */
export default function JurnalBalanceSummary({ totalDebit, totalKredit, seimbang }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <SummaryCard icon={ArrowDownLeft} label="Total Debit" value={totalDebit} accent="blue" />

            <SummaryCard icon={ArrowUpRight} label="Total Kredit" value={totalKredit} accent="rose" />

            <div
                className={` relative overflow-hidden rounded-xl border p-3 sm:p-4 flex items-start justify-between gap-2 sm:gap-3 ${
                    seimbang
                        ? "bg-emerald-50/70 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/40"
                        : "bg-rose-50/70 dark:bg-rose-900/10 border-rose-200 dark:border-rose-900/40"
                } `}
            >
                <div>
                    <p className="text-[9px] uppercase tracking-wider font-semibold text-gray-400">
                        Status
                    </p>

                    <p
                        className={` mt-1 sm:mt-1.5 text-[11px] sm:text-sm font-bold ${seimbang ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"} `}
                    >
                        {seimbang ? "Seimbang" : "Tidak Seimbang"}
                    </p>
                </div>

                <div
                    className={` w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        seimbang
                            ? "bg-emerald-100 dark:bg-emerald-900/30"
                            : "bg-rose-100 dark:bg-rose-900/30"
                    } `}
                >
                    {seimbang ? (
                        <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                        <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 dark:text-rose-400" />
                    )}
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ icon: IconComponent, label, value, accent }) {
    const accents = {
        blue: {
            iconBg: "bg-blue-50 dark:bg-blue-900/20",
            icon: "text-blue-600 dark:text-blue-400",
            text: "text-blue-700 dark:text-blue-400",
        },
        rose: {
            iconBg: "bg-rose-50 dark:bg-rose-900/20",
            icon: "text-rose-600 dark:text-rose-400",
            text: "text-rose-700 dark:text-rose-400",
        },
    };

    const style = accents[accent] || accents.blue;

    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 sm:p-4 flex items-start justify-between gap-2 sm:gap-3">
            <div>
                <p className="text-[9px] uppercase tracking-wider font-semibold text-gray-400">
                    {label}
                </p>

                <p className={` mt-1 sm:mt-1.5 text-[11px] sm:text-sm font-bold tabular-nums ${style.text} `}>
                    {formatPrice(value)}
                </p>
            </div>

            <div
                className={` w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${style.iconBg} `}
            >
                {IconComponent && <IconComponent className={` w-3.5 h-3.5 sm:w-4 sm:h-4 ${style.icon} `} />}
            </div>
        </div>
    );
}
