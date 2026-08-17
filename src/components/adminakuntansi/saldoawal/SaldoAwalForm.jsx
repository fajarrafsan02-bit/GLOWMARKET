import { CalendarDays, CheckCircle2, CircleDollarSign, Landmark, Package, Wallet } from "lucide-react";

import { Panel } from "../LaporanCard.jsx";
import { inputClass } from "../controls.jsx";

import { formatPrice, formatThousand, toMoney } from "../../../utils/format.js";

function Field({ label, icon: Icon, children }) {
    return (
        <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.1em] font-semibold text-gray-400 dark:text-gray-500">
                {Icon && <Icon className="w-3 h-3" />}

                {label}
            </label>

            {children}
        </div>
    );
}

function SummaryRow({ icon: IconComponent, label, description, value, accent = "amber" }) {
    const styles = {
        amber: {
            bg: "bg-amber-50 dark:bg-amber-900/20",
            icon: "text-amber-600 dark:text-amber-400",
        },
        blue: {
            bg: "bg-blue-50 dark:bg-blue-900/20",
            icon: "text-blue-600 dark:text-blue-400",
        },
    };

    const style = styles[accent] || styles.amber;

    return (
        <div className="flex items-center justify-between gap-2 sm:gap-4 py-1.5 sm:py-2">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className={` w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${style.bg} `}>
                    {IconComponent && <IconComponent className={` w-3.5 h-3.5 ${style.icon} `} />}
                </div>

                <div className="min-w-0 pr-1">
                    <p className="text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                        {label}
                    </p>

                    <p className="mt-0.5 text-[9px] text-gray-400 truncate">{description}</p>
                </div>
            </div>

            <span className="text-[11px] sm:text-xs font-semibold text-gray-900 dark:text-white tabular-nums whitespace-nowrap">
                {formatPrice(value)}
            </span>
        </div>
    );
}

export default function SaldoAwalForm({
    kas,
    tanggal,
    onTanggalChange,
    onKasChange,
    total,
    totalProduk,
    nilaiPersediaan,
    saving,
    onSubmit,
}) {
    return (
        <form onSubmit={onSubmit}>
            <Panel
                title="Catat Saldo Awal"
                subtitle="Titik mulai pembukuan berdasarkan kondisi kas dan persediaan sebelum transaksi pertama."
            >
                <div className="p-3 sm:p-5 space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <Field label="Tanggal mulai pembukuan" icon={CalendarDays}>
                            <input
                                type="date"
                                value={tanggal}
                                onChange={(event) => onTanggalChange(event.target.value)}
                                required
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Saldo kas & bank" icon={Wallet}>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 pointer-events-none">
                                    Rp
                                </span>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={kas}
                                    onChange={(event) => onKasChange(formatThousand(event.target.value))}
                                    placeholder="0"
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </Field>
                    </div>

                    {/* Breakdown */}
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="px-3 sm:px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-2 sm:gap-2.5">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                    <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Ringkasan Saldo Awal
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-gray-400">
                                        Nilai yang akan membentuk jurnal pembuka.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 sm:p-4 space-y-2 sm:space-y-2.5">
                            <SummaryRow
                                icon={Wallet}
                                label="Kas & bank"
                                description="Nilai yang Anda masukkan"
                                value={toMoney(kas)}
                            />

                            <SummaryRow
                                icon={Package}
                                label="Persediaan"
                                description={`${totalProduk} produk × harga modal`}
                                value={nilaiPersediaan}
                                accent="blue"
                            />

                            <div className="pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between gap-2 sm:gap-4">
                                    <div className="flex items-center gap-2 sm:gap-2.5">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                            <CircleDollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                                        </div>

                                        <div>
                                            <p className="text-[9px] uppercase tracking-wider font-semibold text-gray-400">
                                                Modal Pemilik
                                            </p>

                                            <p className="mt-0.5 text-[10px] text-gray-400">
                                                Kas + persediaan
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm sm:text-lg font-bold text-amber-600 dark:text-amber-400 tabular-nums whitespace-nowrap">
                                        {formatPrice(total)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="text-[10px] text-gray-400 leading-relaxed">
                            Saldo awal hanya dapat dicatat satu kali.
                        </div>

                        <button
                            type="submit"
                            disabled={saving || total <= 0}
                            className="h-9 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white disabled:text-gray-500 text-[11px] font-semibold transition inline-flex items-center justify-center gap-1.5 shrink-0"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" />

                            {saving ? "Menyimpan..." : "Catat Saldo Awal"}
                        </button>
                    </div>
                </div>
            </Panel>
        </form>
    );
}
