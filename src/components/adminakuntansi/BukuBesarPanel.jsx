import { BookOpen, CreditCard, ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

import { Kosong, Panel, TabelWrapper, tdClass, thClass } from "./LaporanCard.jsx";

import { formatPrice } from "../../utils/format.js";

/**
 * Mutasi satu akun beserta saldo berjalannya,
 * seperti buku besar pada umumnya.
 *
 * LOGIC / DATA FLOW TIDAK DIUBAH.
 */
export default function BukuBesarPanel({ data }) {
    if (!data) return null;

    const mutasi = Array.isArray(data.mutasi) ? data.mutasi : [];

    return (
        <Panel
            title={`${data.kodeAkun} — ${data.namaAkun}`}
            subtitle={`Saldo normal ${data.saldoNormal} • ${data.mulai} s/d ${data.sampai}`}
        >
            {/* =====================================================
                ACCOUNT SUMMARY
            ====================================================== */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <SummaryCard icon={Wallet} label="Saldo awal" value={data.saldoAwal} />

                <SummaryCard
                    icon={ArrowDownLeft}
                    label="Total debit"
                    value={data.totalDebit}
                    accent="blue"
                />

                <SummaryCard
                    icon={ArrowUpRight}
                    label="Total kredit"
                    value={data.totalKredit}
                    accent="rose"
                />

                <SummaryCard
                    icon={CreditCard}
                    label="Saldo akhir"
                    value={data.saldoAkhir}
                    accent="amber"
                    highlight
                />
            </div>

            {/* =====================================================
                MUTATION TABLE
            ====================================================== */}

            {mutasi.length === 0 ? (
                <Kosong>Belum ada mutasi pada akun ini di rentang tanggal tersebut.</Kosong>
            ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                    {/* Table Header */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Mutasi Buku Besar
                                </h3>

                                <p className="mt-0.5 text-[10px] text-gray-400">
                                    {mutasi.length} mutasi tercatat
                                </p>
                            </div>
                        </div>

                        <span className="hidden sm:inline-flex px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[9px] font-medium text-gray-500 dark:text-gray-400">
                            GENERAL LEDGER
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <TabelWrapper>
                            <thead>
                                <tr>
                                    <th className={thClass}>Tanggal</th>

                                    <th className={thClass}>No. Jurnal</th>

                                    <th className={thClass}>Keterangan</th>

                                    <th className={`${thClass} text-right`}>Debit</th>

                                    <th className={`${thClass} text-right`}>Kredit</th>

                                    <th className={`${thClass} text-right`}>Saldo</th>
                                </tr>
                            </thead>

                            <tbody>
                                {mutasi.map((baris, index) => {
                                    const hasDebit = Number(baris.debit) > 0;

                                    const hasKredit = Number(baris.kredit) > 0;

                                    return (
                                        <tr
                                            key={`${baris.nomorJurnal}-${index}`}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        >
                                            {/* Tanggal */}
                                            <td className={`${tdClass} whitespace-nowrap`}>
                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                    {baris.tanggal}
                                                </span>
                                            </td>

                                            {/* Nomor Jurnal */}
                                            <td className={`${tdClass} whitespace-nowrap`}>
                                                <span className="inline-flex px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-mono text-gray-600 dark:text-gray-400">
                                                    {baris.nomorJurnal}
                                                </span>
                                            </td>

                                            {/* Keterangan */}
                                            <td className={`${tdClass} min-w-[220px]`}>
                                                <span className="text-xs text-gray-700 dark:text-gray-300">
                                                    {baris.keterangan}
                                                </span>
                                            </td>

                                            {/* Debit */}
                                            <td className={`${tdClass} text-right tabular-nums`}>
                                                {hasDebit ? (
                                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                                        {formatPrice(baris.debit)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300 dark:text-gray-700">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            {/* Kredit */}
                                            <td className={`${tdClass} text-right tabular-nums`}>
                                                {hasKredit ? (
                                                    <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                                                        {formatPrice(baris.kredit)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300 dark:text-gray-700">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            {/* Saldo */}
                                            <td className={`${tdClass} text-right tabular-nums`}>
                                                <span className="text-xs font-bold text-gray-900 dark:text-white">
                                                    {formatPrice(baris.saldo)}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </TabelWrapper>
                    </div>
                </div>
            )}
        </Panel>
    );
}

/* ================================================================
   SUMMARY CARD
================================================================ */

function SummaryCard({ icon: IconComponent, label, value, accent = "gray", highlight = false }) {
    const accents = {
        gray: {
            iconBg: "bg-gray-100 dark:bg-gray-800",
            icon: "text-gray-500 dark:text-gray-400",
        },

        blue: {
            iconBg: "bg-blue-50 dark:bg-blue-900/20",
            icon: "text-blue-600 dark:text-blue-400",
        },

        rose: {
            iconBg: "bg-rose-50 dark:bg-rose-900/20",
            icon: "text-rose-600 dark:text-rose-400",
        },

        amber: {
            iconBg: "bg-amber-50 dark:bg-amber-900/20",
            icon: "text-amber-600 dark:text-amber-400",
        },
    };

    const style = accents[accent] || accents.gray;

    return (
        <div
            className={` relative overflow-hidden rounded-xl border p-3 sm:p-4 ${highlight ? ` bg-amber-50/70 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/40 ` : ` bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 `} `}
        >
            {highlight && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500" />}

            <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="min-w-0 pr-1">
                    <p className="text-[9px] uppercase tracking-wider font-semibold text-gray-400">
                        {label}
                    </p>

                    <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-sm font-bold text-gray-900 dark:text-white tabular-nums truncate" title={formatPrice(value)}>
                        {formatPrice(value)}
                    </p>
                </div>

                <div
                    className={` w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center ${style.iconBg} `}
                >
                    {IconComponent && <IconComponent className={` w-3.5 h-3.5 sm:w-4 sm:h-4 ${style.icon} `} />}
                </div>
            </div>
        </div>
    );
}
