export default function CustomerStat({ label, value }) {
    return (
        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-[9px] uppercase tracking-wider text-gray-400">{label}</p>

            <p
                className="mt-1 text-xs font-semibold text-gray-800 dark:text-gray-200 truncate"
                title={String(value)}
            >
                {value}
            </p>
        </div>
    );
}
