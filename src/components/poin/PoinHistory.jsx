import { Coins, Loader2 } from "lucide-react";

import { formatDateTime } from "../../utils/format.js";

export default function PoinHistory({ loading, riwayat }) {
    return (
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />

                <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Riwayat Poin</h2>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-6 sm:py-8 text-gray-400">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                </div>
            ) : riwayat.length === 0 ? (
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Belum ada aktivitas poin. Lakukan pembelian untuk mulai mengumpulkan.
                </p>
            ) : (
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    {riwayat.map((r) => (
                        <li key={r.id} className="flex items-center justify-between gap-3 sm:gap-4 py-2.5 sm:py-3">
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                                    {r.keterangan}
                                </p>

                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {formatDateTime(r.createdAt)}
                                </p>
                            </div>

                            <span
                                className={`shrink-0 text-xs sm:text-sm font-bold ${r.jumlah >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                            >
                                {r.jumlah >= 0 ? "+" : ""}
                                {Number(r.jumlah).toLocaleString("id-ID")}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
