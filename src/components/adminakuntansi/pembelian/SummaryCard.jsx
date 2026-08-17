export default function SummaryCard({ icon: IconComponent, label, value }) {
    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div>
                    <p className="text-[9px] uppercase tracking-wider font-semibold text-gray-400">
                        {label}
                    </p>

                    <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-sm font-bold text-gray-900 dark:text-white">
                        {value}
                    </p>
                </div>

                <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                    {IconComponent && (
                        <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                    )}
                </div>
            </div>
        </div>
    );
}
