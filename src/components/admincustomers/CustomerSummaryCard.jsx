export default function CustomerSummaryCard({ icon, label, value, color }) {
    const IconComp = icon;

    const styles = {
        gray: {
            bg: "bg-gray-100 dark:bg-gray-800",
            icon: "text-gray-500 dark:text-gray-400",
        },
        emerald: {
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            icon: "text-emerald-600 dark:text-emerald-400",
        },
    };

    const style = styles[color] ?? styles.gray;

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="min-w-0">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-400 truncate">{label}</p>

                    <p className="mt-0.5 sm:mt-1 text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>

                <div className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center ${style.bg}`}>
                    <IconComp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${style.icon}`} />
                </div>
            </div>
        </div>
    );
}
