import { CalendarDays, XCircle } from "lucide-react";

import { Kosong, TabelWrapper, tdClass, thClass } from "../LaporanCard.jsx";
import { formatPrice } from "../../../utils/format.js";

export default function BebanHistoryTable({ daftar, totalAktif, onCancel }) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Riwayat Biaya
                    </h2>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                        Catatan pengeluaran operasional toko.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[9px] font-medium text-gray-500 dark:text-gray-400">
                        {daftar.length} catatan
                    </span>

                    <span className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-900/20 text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                        {formatPrice(totalAktif)}
                    </span>
                </div>
            </div>

            {/* Table */}
            {daftar.length === 0 ? (
                <Kosong>Belum ada biaya tercatat pada rentang tanggal ini.</Kosong>
            ) : (
                <div className="overflow-x-auto">
                    <TabelWrapper>
                        <thead>
                            <tr>
                                <th className={thClass}>Tanggal</th>

                                <th className={thClass}>Jenis Beban</th>

                                <th className={thClass}>Keterangan</th>

                                <th className={`${thClass} text-right`}>Jumlah</th>

                                <th className={`${thClass} text-center`}>Status</th>

                                <th className={`${thClass} text-right`}>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {daftar.map((beban) => {
                                const dibatalkan = Boolean(beban.dibatalkan);

                                return (
                                    <tr
                                        key={beban.id}
                                        className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                                    >
                                        <td className={`${tdClass} whitespace-nowrap`}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                    <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                                                </div>

                                                <span>{beban.tanggal}</span>
                                            </div>
                                        </td>

                                        <td className={tdClass}>
                                            <div>
                                                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                                    {beban.namaAkun}
                                                </p>

                                                {beban.kodeAkun && (
                                                    <p className="mt-0.5 text-[9px] text-gray-400">
                                                        {beban.kodeAkun}
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        <td className={tdClass}>
                                            <span className="text-xs text-gray-600 dark:text-gray-300">
                                                {beban.keterangan}
                                            </span>
                                        </td>

                                        <td className={`${tdClass} text-right`}>
                                            <span
                                                className={` text-xs font-semibold tabular-nums ${dibatalkan ? "text-gray-400 line-through" : "text-gray-900 dark:text-white"} `}
                                            >
                                                {formatPrice(beban.jumlah)}
                                            </span>
                                        </td>

                                        <td className={`${tdClass} text-center`}>
                                            {dibatalkan ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[9px] font-semibold text-gray-500 dark:text-gray-400">
                                                    <XCircle className="w-3 h-3" />
                                                    Dibatalkan
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Aktif
                                                </span>
                                            )}
                                        </td>

                                        <td className={`${tdClass} text-right`}>
                                            {!dibatalkan && (
                                                <button
                                                    type="button"
                                                    onClick={() => onCancel(beban)}
                                                    className="px-2 py-1 rounded-md text-[10px] font-medium text-rose-600 hover:text-white hover:bg-rose-500 transition"
                                                >
                                                    Batalkan
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                        <tfoot>
                            <tr className="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <td className={`${tdClass} font-semibold`} colSpan={3}>
                                    Total Biaya Aktif
                                </td>

                                <td
                                    className={`${tdClass} text-right font-bold text-amber-600 dark:text-amber-400 tabular-nums`}
                                >
                                    {formatPrice(totalAktif)}
                                </td>

                                <td className={tdClass} />

                                <td className={tdClass} />
                            </tr>
                        </tfoot>
                    </TabelWrapper>
                </div>
            )}
        </div>
    );
}
