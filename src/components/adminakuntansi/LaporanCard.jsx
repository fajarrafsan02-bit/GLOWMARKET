import { AlertTriangle, ChevronRight } from "lucide-react";

import { formatPrice } from "../../utils/format.js";

/* ================================================================
   PANEL UTAMA LAPORAN
================================================================ */

export function Panel({ title, subtitle, children, noPadding = false }) {
    return (
        <section className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
            {(title || subtitle) && (
                <div className="px-4 sm:px-6 py-3 sm:py-4.5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="min-w-0">
                        {title && (
                            <h3 className="text-[15px] sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                {title}
                            </h3>
                        )}

                        {subtitle && (
                            <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className={noPadding ? "" : "p-3 sm:p-6"}>{children}</div>
        </section>
    );
}

/* ================================================================
   BARIS NILAI
   Dipakai untuk laporan laba rugi dan laporan ringkasan lainnya.
================================================================ */

export function BarisNilai({ label, nilai, indent = false, tebal = false, sorot = false }) {
    const numericValue = Number(nilai) || 0;

    return (
        <div
            className={` group flex items-center justify-between gap-2 sm:gap-4 min-h-[40px] px-4 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-sm border-b border-gray-100 dark:border-gray-800/60 last:border-b-0 transition-colors ${sorot ? ` bg-amber-50/70 dark:bg-amber-900/10 ` : ` hover:bg-gray-50/70 dark:hover:bg-gray-800/40 `} `}
        >
            <div className={` min-w-0 flex items-center gap-1.5 sm:gap-2 ${indent ? "pl-3 sm:pl-6" : ""} `}>
                {indent && (
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
                )}

                <span
                    className={` truncate ${tebal ? ` font-bold text-gray-900 dark:text-white ` : ` font-normal text-gray-600 dark:text-gray-300 `} `}
                    title={label}
                >
                    {label}
                </span>
            </div>

            <span
                className={` shrink-0 text-right tabular-nums whitespace-nowrap ${numericValue < 0 ? ` text-rose-600 dark:text-rose-400 font-semibold ` : tebal ? ` text-gray-900 dark:text-white font-bold ` : ` text-gray-700 dark:text-gray-300 font-medium `} `}
            >
                {formatPrice(numericValue)}
            </span>
        </div>
    );
}

/* ================================================================
   JUDUL GOLONGAN
================================================================ */

export function JudulGolongan({ children }) {
    return (
        <div className="flex items-center min-h-[32px] px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 dark:bg-gray-800/60 border-y border-gray-100 dark:border-gray-800 text-[8px] sm:text-[10px] uppercase tracking-[0.12em] font-semibold text-gray-500 dark:text-gray-400">
            {children}
        </div>
    );
}

/* ================================================================
   EMPTY STATE
================================================================ */

export function Kosong({ children }) {
    return (
        <div className="flex flex-col items-center justify-center px-5 py-10 sm:py-12 text-center">
            <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                <span className="text-sm text-gray-400">—</span>
            </div>

            <p className="max-w-sm text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
                {children}
            </p>
        </div>
    );
}

/* ================================================================
   WARNING / PERINGATAN
================================================================ */

export function Peringatan({ children }) {
    return (
        <div className="mb-3 sm:mb-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-900/10 px-3 sm:px-4 py-2.5 sm:py-3">
            <div className="flex items-start gap-3">
                <div className="w-7 h-7 shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                </div>

                <div className="min-w-0 text-[10px] sm:text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                    {children}
                </div>
            </div>
        </div>
    );
}

/* ================================================================
   TABLE WRAPPER
================================================================ */

export function TabelWrapper({ children }) {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] sm:min-w-[760px] text-[11px] sm:text-xs border-collapse">{children}</table>
        </div>
    );
}

/* ================================================================
   TABLE HEADER
================================================================ */

export const thClass = `
    px-3
    sm:px-5
    py-2.5
    sm:py-3
    text-left
    text-[9px]
    sm:text-[10px]
    uppercase
    tracking-[0.1em]
    font-semibold
    text-gray-400
    dark:text-gray-500
    whitespace-nowrap
    bg-gray-50/80
    dark:bg-gray-800/50
    border-b
    border-gray-100
    dark:border-gray-800
`;

/* ================================================================
   TABLE CELL
================================================================ */

export const tdClass = `
    px-3
    sm:px-5
    py-2.5
    sm:py-3
    text-gray-600
    dark:text-gray-300
    border-b
    border-gray-50
    dark:border-gray-800/60
    align-middle
`;
