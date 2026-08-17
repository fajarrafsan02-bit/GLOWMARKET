export default function ReportSection({
    icon: IconComponent,
    title,
    description,
    accent = "gray",
    children,
}) {
    const styles = {
        emerald: {
            iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
            icon: "text-emerald-600 dark:text-emerald-400",
        },
        blue: {
            iconBg: "bg-blue-50 dark:bg-blue-900/20",
            icon: "text-blue-600 dark:text-blue-400",
        },
        rose: {
            iconBg: "bg-rose-50 dark:bg-rose-900/20",
            icon: "text-rose-600 dark:text-rose-400",
        },
        gray: {
            iconBg: "bg-gray-100 dark:bg-gray-800",
            icon: "text-gray-500 dark:text-gray-400",
        },
    };

    const style = styles[accent] || styles.gray;

    return (
        <div className="mb-3 sm:mb-4 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
            {/* Section header */}
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50/70 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 sm:gap-3">
                <div
                    className={` w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center ${style.iconBg} `}
                >
                    {IconComponent && <IconComponent className={` w-3.5 h-3.5 sm:w-4 sm:h-4 ${style.icon} `} />}
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>

                    <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                        {description}
                    </p>
                </div>
            </div>

            {/* Rows */}
            <div>{children}</div>
        </div>
    );
}
