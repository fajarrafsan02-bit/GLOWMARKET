export default function ProfileRow({ icon: IconComponent, label, badge, value, valueClassName }) {
    return (
        <div className="px-4 sm:px-5 py-4 flex items-start gap-4">
            <div className="w-9 h-9 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {IconComponent && <IconComponent className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[11px] uppercase tracking-[0.1em] text-gray-400">{label}</p>

                    {badge}
                </div>

                <p
                    className={` mt-1 text-sm font-medium text-gray-900 dark:text-white ${
                        valueClassName || ""
                    } `}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}
