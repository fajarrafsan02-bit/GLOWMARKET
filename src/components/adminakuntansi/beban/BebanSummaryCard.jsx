export default function BebanSummaryCard({ icon: IconComponent, label, value, accent = "amber" }) {
    const styles = {
        amber: {
            bg: "bg-amber-50 dark:bg-amber-900/20",
            icon: "text-amber-600 dark:text-amber-400",
        },
        blue: {
            bg: "bg-blue-50 dark:bg-blue-900/20",
            icon: "text-blue-600 dark:text-blue-400",
        },
        emerald: {
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            icon: "text-emerald-600 dark:text-emerald-400",
        },
        rose: {
            bg: "bg-rose-50 dark:bg-rose-900/20",
            icon: "text-rose-600 dark:text-rose-400",
        },
    };

    const style = styles[accent] || styles.amber;

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="min-w-0 pr-1">
                    <p className="text-[9px] uppercase tracking-wider font-semibold text-gray-400">
                        {label}
                    </p>

                    <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-base font-bold text-gray-900 dark:text-white tabular-nums truncate" title={value}>
                        {value}
                    </p>
                </div>

                <div
                    className={` w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center ${style.bg} `}
                >
                    {IconComponent && <IconComponent className={` w-3.5 h-3.5 sm:w-4 sm:h-4 ${style.icon} `} />}
                </div>
            </div>
        </div>
    );
}
