export default function SectionHeader({ icon: IconComponent, title, description, accent = "blue" }) {
    const styles = {
        blue: {
            bg: "bg-blue-50 dark:bg-blue-900/20",
            icon: "text-blue-600 dark:text-blue-400",
        },
        rose: {
            bg: "bg-rose-50 dark:bg-rose-900/20",
            icon: "text-rose-600 dark:text-rose-400",
        },
        amber: {
            bg: "bg-amber-50 dark:bg-amber-900/20",
            icon: "text-amber-600 dark:text-amber-400",
        },
    };

    const style = styles[accent] || styles.blue;

    return (
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 flex items-center gap-2 sm:gap-3">
            <div className={` w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center ${style.bg} `}>
                {IconComponent && <IconComponent className={` w-3.5 h-3.5 sm:w-4 sm:h-4 ${style.icon} `} />}
            </div>

            <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>

                <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">{description}</p>
            </div>
        </div>
    );
}
