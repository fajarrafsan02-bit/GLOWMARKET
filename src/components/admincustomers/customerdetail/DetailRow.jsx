export default function DetailRow({ icon: Icon, label, value, valueClass = "" }) {
    return (
        <div className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2.5 sm:py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-800">
            <div className="w-7 h-7 shrink-0 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400">{label}</p>

                <p
                    className={` mt-0.5 text-[11px] sm:text-xs font-medium break-words ${valueClass || "text-gray-800 dark:text-gray-200"} `}
                >
                    {value || "-"}
                </p>
            </div>
        </div>
    );
}
