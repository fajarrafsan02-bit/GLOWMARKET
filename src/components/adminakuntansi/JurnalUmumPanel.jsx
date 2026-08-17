import { BookMarked, AlertTriangle, CalendarDays, FileText, Layers3 } from "lucide-react";

import { Kosong, Panel, Peringatan, TabelWrapper, tdClass, thClass } from "./LaporanCard.jsx";
import JurnalBalanceSummary from "./JurnalBalanceSummary.jsx";

import { formatPrice, toMoney } from "../../utils/format.js";

const WARNA_SUMBER = {
    PENJUALAN: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",

    PEMBELIAN: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",

    BEBAN: "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",

    SALDO_AWAL: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",

    PENYESUAIAN: "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400",

    PELUNASAN: "bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400",

    REFUND: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",

    MANUAL: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

/**
 * Daftar seluruh jurnal beserta barisnya.
 *
 * NOTE:
 * Tidak ada perubahan pada data maupun logic akuntansi.
 * Perubahan di sini hanya pada tampilan.
 */
export default function JurnalUmumPanel({ data, selisih }) {
    const jurnalList = Array.isArray(data) ? data : [];

    const adaSelisih = toMoney(selisih) !== 0;

    // Total debit dan kredit seluruh jurnal yang tampil — harus selalu sama
    // besar (balance) karena setiap jurnal memakai double entry.
    const totalDebit = jurnalList.reduce((sum, jurnal) => sum + toMoney(jurnal.totalDebit), 0);

    const totalKredit = jurnalList.reduce((sum, jurnal) => sum + toMoney(jurnal.totalKredit), 0);

    const seimbang = totalDebit === totalKredit;

    return (
        <div className="space-y-4">
            {/* =====================================================
                WARNING
            ====================================================== */}

            {adaSelisih && (
                <Peringatan>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                                Pembukuan tidak seimbang
                            </p>

                            <p className="mt-0.5 text-[10px] leading-relaxed text-rose-700 dark:text-rose-400">
                                Total debit dan kredit berselisih{" "}
                                <span className="font-semibold">{formatPrice(selisih)}</span>.
                                Seharusnya nol.
                            </p>
                        </div>
                    </div>
                </Peringatan>
            )}

            {/* =====================================================
                PANEL
            ====================================================== */}

            <Panel title="Jurnal Umum" subtitle={`${jurnalList.length} jurnal pada periode ini`}>
                {jurnalList.length === 0 ? (
                    <Kosong>Belum ada jurnal pada rentang tanggal ini.</Kosong>
                ) : (
                    <div className="overflow-hidden">
                        {/* =================================================
                            BALANCE SUMMARY (DEBIT = KREDIT)
                        ================================================== */}

                        <JurnalBalanceSummary
                            totalDebit={totalDebit}
                            totalKredit={totalKredit}
                            seimbang={seimbang}
                        />

                        {/* =================================================
                            TABLE HEADER INFO
                        ================================================== */}

                        <div className="px-1 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                    <BookMarked className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Daftar Jurnal
                                    </h3>

                                    <p className="mt-0.5 text-[10px] text-gray-400">
                                        Setiap jurnal ditampilkan sebagai satu kelompok transaksi
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <MetaBadge icon={FileText} label={`${jurnalList.length} jurnal`} />

                                <MetaBadge icon={Layers3} label="Double entry" />
                            </div>
                        </div>

                        {/* =================================================
                            TABLE
                        ================================================== */}

                        <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
                            <div className="overflow-x-auto">
                                <TabelWrapper>
                                    <thead>
                                        <tr>
                                            <th className={`${thClass} w-[120px]`}>Tanggal</th>

                                            <th className={`${thClass} w-[150px]`}>No. Jurnal</th>

                                            <th className={`${thClass} w-[120px]`}>Sumber</th>

                                            <th className={thClass}>Akun</th>

                                            <th className={`${thClass} text-right w-[150px]`}>
                                                Debit
                                            </th>

                                            <th className={`${thClass} text-right w-[150px]`}>
                                                Kredit
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {jurnalList.map((jurnal) => {
                                            const barisList = Array.isArray(jurnal.baris)
                                                ? jurnal.baris
                                                : [];

                                            if (barisList.length === 0) {
                                                return null;
                                            }

                                            return barisList.map((baris, index) => {
                                                const debit = toMoney(baris.debit);

                                                const kredit = toMoney(baris.kredit);

                                                const isFirst = index === 0;

                                                const isLast = index === barisList.length - 1;

                                                return (
                                                    <tr
                                                        key={`${jurnal.id}-${index}`}
                                                        className={` group ${isFirst ? "border-t-2" : ""} border-gray-100 dark:border-gray-800 hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors `}
                                                    >
                                                        {/* =========================================
                                                                    JOURNAL META
                                                                    Dibuat rowSpan agar tidak ada
                                                                    area kosong pada baris kedua.
                                                                ========================================== */}

                                                        {isFirst && (
                                                            <>
                                                                {/* DATE */}
                                                                <td
                                                                    rowSpan={barisList.length}
                                                                    className="px-4 py-4 align-top bg-gray-50/60 dark:bg-gray-800/30 border-r border-gray-100 dark:border-gray-800"
                                                                >
                                                                    <div className="flex items-start gap-2">
                                                                        <CalendarDays className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" />

                                                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                                                            {jurnal.tanggal}
                                                                        </span>
                                                                    </div>
                                                                </td>

                                                                {/* JOURNAL NUMBER */}
                                                                <td
                                                                    rowSpan={barisList.length}
                                                                    className="px-4 py-4 align-top bg-gray-50/60 dark:bg-gray-800/30 border-r border-gray-100 dark:border-gray-800"
                                                                >
                                                                    <span className="inline-flex px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-mono font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                                        {jurnal.nomor}
                                                                    </span>
                                                                </td>

                                                                {/* SOURCE */}
                                                                <td
                                                                    rowSpan={barisList.length}
                                                                    className="px-4 py-4 align-top bg-gray-50/60 dark:bg-gray-800/30 border-r border-gray-100 dark:border-gray-800"
                                                                >
                                                                    <span
                                                                        className={` inline-flex px-2.5 py-1 rounded-md text-[9px] font-semibold tracking-wide whitespace-nowrap ${WARNA_SUMBER[jurnal.sumber] || WARNA_SUMBER.MANUAL} `}
                                                                    >
                                                                        {jurnal.sumber}
                                                                    </span>
                                                                </td>
                                                            </>
                                                        )}

                                                        {/* =========================================
                                                                    ACCOUNT
                                                                ========================================== */}

                                                        <td
                                                            className={` ${tdClass} align-top min-w-[320px] `}
                                                        >
                                                            <div
                                                                className={` ${kredit > 0 ? "pl-7" : "pl-1"} `}
                                                            >
                                                                <div className="flex items-start gap-2">
                                                                    {kredit > 0 && (
                                                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0" />
                                                                    )}

                                                                    <div>
                                                                        <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                                                                            <span className="font-mono text-[10px] text-gray-400">
                                                                                {baris.kodeAkun}
                                                                            </span>

                                                                            <span className="mx-1.5 text-gray-300 dark:text-gray-700">
                                                                                •
                                                                            </span>

                                                                            <span className="font-medium">
                                                                                {baris.namaAkun}
                                                                            </span>
                                                                        </p>

                                                                        <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed">
                                                                            {baris.keterangan ||
                                                                                jurnal.keterangan}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* =========================================
                                                                    DEBIT
                                                                ========================================== */}

                                                        <td
                                                            className={`${tdClass} text-right align-top tabular-nums`}
                                                        >
                                                            {debit > 0 ? (
                                                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                                                    {formatPrice(baris.debit)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-300 dark:text-gray-700">
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* =========================================
                                                                    KREDIT
                                                                ========================================== */}

                                                        <td
                                                            className={`${tdClass} text-right align-top tabular-nums`}
                                                        >
                                                            {kredit > 0 ? (
                                                                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                                                                    {formatPrice(baris.kredit)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-300 dark:text-gray-700">
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>

                                                        {isLast && null}
                                                    </tr>
                                                );
                                            });
                                        })}
                                    </tbody>

                                    <tfoot>
                                        <tr className="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                            <td
                                                colSpan={4}
                                                className="px-4 sm:px-5 py-3 text-xs font-bold text-gray-900 dark:text-white"
                                            >
                                                Total
                                            </td>

                                            <td className="px-4 sm:px-5 py-3 text-right text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums whitespace-nowrap">
                                                {formatPrice(totalDebit)}
                                            </td>

                                            <td className="px-4 sm:px-5 py-3 text-right text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums whitespace-nowrap">
                                                {formatPrice(totalKredit)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </TabelWrapper>
                            </div>
                        </div>
                    </div>
                )}
            </Panel>
        </div>
    );
}

/* ================================================================
   META BADGE
================================================================ */

function MetaBadge({ icon: IconComponent, label }) {
    return (
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[9px] font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {IconComponent && <IconComponent className="w-3 h-3" />}
            {label}
        </span>
    );
}
