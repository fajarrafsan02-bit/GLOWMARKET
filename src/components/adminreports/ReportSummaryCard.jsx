export default function ReportSummaryCard({ label, value }) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-4">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-400">{label}</p>

            <p className="mt-1 sm:mt-1.5 text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">{value}</p>
        </div>
    );
}
