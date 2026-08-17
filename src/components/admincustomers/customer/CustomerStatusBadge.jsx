export default function CustomerStatusBadge({ isActive, compact = false }) {
    if (compact) {
        return (
            <span
                className={` inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-medium ${isActive ? ` bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ` : ` bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 `} `}
            >
                <span
                    className={` w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"} `}
                />

                {isActive ? "Aktif" : "Nonaktif"}
            </span>
        );
    }

    return (
        <span
            className={` inline-flex items-center gap-1.5 text-[10px] font-medium ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"} `}
        >
            <span
                className={` w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"} `}
            />

            {isActive ? "Aktif" : "Nonaktif"}
        </span>
    );
}
