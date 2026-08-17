import { CalendarDays, Plus } from "lucide-react";

import { Field, inputClass } from "../controls.jsx";
import { formatThousand } from "../../../utils/format.js";

export default function BebanForm({
    tanggal,
    onTanggalChange,
    kodeAkun,
    onKodeAkunChange,
    keterangan,
    onKeteranganChange,
    jumlah,
    onJumlahChange,
    akunBeban,
    saving,
    onSubmit,
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Catat Biaya Operasional
                            </h2>

                            <p className="mt-0.5 text-[10px] text-gray-400">
                                Tambahkan pengeluaran operasional toko.
                            </p>
                        </div>
                    </div>

                    <span className="hidden sm:inline-flex px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[9px] font-medium text-gray-500 dark:text-gray-400">
                        OPERASIONAL
                    </span>
                </div>

                {/* Form */}
                <div className="p-3 sm:p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[150px_1fr_1.3fr_180px_auto] gap-3 sm:gap-4 items-end">
                        <Field label="Tanggal">
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />

                                <input
                                    type="date"
                                    value={tanggal}
                                    onChange={(event) => onTanggalChange(event.target.value)}
                                    required
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </Field>

                        <Field label="Jenis Beban">
                            <select
                                value={kodeAkun}
                                onChange={(event) => onKodeAkunChange(event.target.value)}
                                required
                                className={inputClass}
                            >
                                <option value="">Pilih jenis beban</option>

                                {akunBeban.map((akun) => (
                                    <option key={akun.kode} value={akun.kode}>
                                        {akun.nama}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Keterangan">
                            <input
                                type="text"
                                value={keterangan}
                                onChange={(event) => onKeteranganChange(event.target.value)}
                                required
                                placeholder="Contoh: Sewa toko, listrik, internet..."
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Jumlah">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-gray-400">
                                    Rp
                                </span>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={jumlah}
                                    onChange={(event) => onJumlahChange(formatThousand(event.target.value))}
                                    required
                                    placeholder="0"
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </Field>

                        <button
                            type="submit"
                            disabled={saving}
                            className="h-9 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-[11px] font-semibold transition flex items-center justify-center gap-1.5"
                        >
                            <Plus className="w-3.5 h-3.5" />

                            {saving ? "Menyimpan..." : "Simpan Biaya"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
