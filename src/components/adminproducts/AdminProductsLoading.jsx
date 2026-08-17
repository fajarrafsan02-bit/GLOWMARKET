export default function AdminProductsLoading() {
    return (
        <div className="space-y-4">
            {/* =================================================
                DESKTOP TABLE SKELETON
            ================================================== */}
            <div className="hidden lg:block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full table-fixed">
                    <colgroup>
                        <col className="w-[28%]" />
                        <col className="w-[18%]" />
                        <col className="w-[12%]" />
                        <col className="w-[18%]" />
                        <col className="w-[13%]" />
                        <col className="w-[11%]" />
                    </colgroup>

                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900">
                            <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                Produk
                            </th>
                            <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                Harga
                            </th>
                            <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                Stok
                            </th>
                            <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                Spesifikasi
                            </th>
                            <th className="px-6 py-3.5 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                Status
                            </th>
                            <th className="px-6 py-3.5 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <tr key={index} className="animate-pulse">
                                {/* Produk */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-800" />
                                        <div className="space-y-1.5 min-w-0">
                                            <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-32" />
                                            <div className="h-2.5 bg-gray-200 dark:bg-gray-800 rounded w-12" />
                                        </div>
                                    </div>
                                </td>

                                {/* Harga */}
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
                                </td>

                                {/* Stok */}
                                <td className="px-6 py-4">
                                    <div className="space-y-1.5">
                                        <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-12" />
                                        <div className="h-2.5 bg-gray-200 dark:bg-gray-800 rounded w-8" />
                                    </div>
                                </td>

                                {/* Spesifikasi */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-md w-8" />
                                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-10" />
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4 text-center">
                                    <div className="mx-auto h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-20" />
                                </td>

                                {/* Aksi */}
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center items-center gap-1.5">
                                        <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800" />
                                        <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* =================================================
                MOBILE CARD SKELETON
            ================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 animate-pulse space-y-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 shrink-0" />
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-28" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-14" />
                                </div>
                            </div>
                            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-16 shrink-0" />
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="h-10 bg-gray-100 dark:bg-gray-800/60 rounded-lg p-2 space-y-1">
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-10" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                            </div>
                            <div className="h-10 bg-gray-100 dark:bg-gray-800/60 rounded-lg p-2 space-y-1">
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-10" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800" />
                            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
