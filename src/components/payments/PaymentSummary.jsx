export default function PaymentSummary({ totalPayments, paidPayments }) {
    return (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6">
            <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-lg sm:rounded-none">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-gray-400 truncate">
                    Total Transaksi
                </p>

                <p className="mt-1 flex items-baseline gap-1 text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
                    {totalPayments}
                </p>
            </div>

            <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-lg sm:rounded-none">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-gray-400 truncate">Berhasil</p>

                <p className="mt-1 text-base sm:text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                    {paidPayments}
                </p>
            </div>
        </div>
    );
}
