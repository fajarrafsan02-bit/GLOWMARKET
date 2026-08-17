import { CalendarDays, Filter, RefreshCw } from "lucide-react";

const dateInputClass =
    "w-full sm:w-auto h-9 pl-8.5 pr-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[11px] sm:text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10";

export default function ReportHeader({
    reportStartDate,
    onStartDateChange,
    reportEndDate,
    onEndDateChange,
    loadingReport,
    onRefresh,
}) {
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                {/* Title */}
                <div>
                    <div className="flex items-center gap-2 sm:gap-2.5">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                            <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                        </div>

                        <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                            Laporan Harian
                        </h2>
                    </div>

                    <p className="mt-1 ml-9 sm:ml-10.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        Monitor transaksi dan pendapatan berdasarkan periode.
                    </p>
                </div>

                {/* Date Filters */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-2.5">
                    {/* Start Date */}
                    <div className="relative w-full sm:w-auto">
                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />

                        <input
                            type="date"
                            value={reportStartDate}
                            max={reportEndDate}
                            onChange={(e) => onStartDateChange(e.target.value)}
                            className={dateInputClass}
                        />
                    </div>

                    <span className="hidden sm:inline-block text-xs text-gray-400 px-0.5">sampai</span>
                    <span className="sm:hidden text-[10px] text-gray-400 text-center -my-1">sampai dengan</span>

                    {/* End Date */}
                    <div className="relative w-full sm:w-auto">
                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />

                        <input
                            type="date"
                            value={reportEndDate}
                            min={reportStartDate}
                            max={today}
                            onChange={(e) => onEndDateChange(e.target.value)}
                            className={dateInputClass}
                        />
                    </div>

                    <div className="flex items-center gap-2 mt-1 sm:mt-0">
                        <button
                            type="button"
                            className="h-9 px-3.5 flex-1 sm:flex-none rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                        >
                            <Filter className="w-3.5 h-3.5" />
                            Filter
                        </button>

                        <button
                            type="button"
                            disabled={loadingReport}
                            onClick={onRefresh}
                            className="w-9 h-9 shrink-0 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 flex items-center justify-center transition"
                            title="Refresh laporan"
                        >
                            <RefreshCw className={` w-3.5 h-3.5 ${loadingReport ? "animate-spin" : ""} `} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
