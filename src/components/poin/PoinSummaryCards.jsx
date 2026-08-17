import { formatPrice } from "../../utils/format.js";

export default function PoinSummaryCards({ loading, saldo, totalDiperoleh, totalDipakai }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-4 sm:p-6 text-white">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider opacity-80">Saldo Poin</p>

                <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold">
                    {loading ? "..." : saldo.toLocaleString("id-ID")}
                </p>

                <p className="mt-1 text-[10px] sm:text-xs opacity-90">
                    100 poin = {formatPrice(10000)} voucher
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Total Diperoleh
                </p>

                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {loading ? "..." : totalDiperoleh.toLocaleString("id-ID")}
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Total Dipakai
                </p>

                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {loading ? "..." : totalDipakai.toLocaleString("id-ID")}
                </p>
            </div>
        </div>
    );
}
