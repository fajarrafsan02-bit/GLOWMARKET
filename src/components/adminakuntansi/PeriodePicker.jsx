import { CalendarDays, Download, ArrowRight } from "lucide-react";

/**
 * Pemilih rentang tanggal yang dipakai bersama oleh
 * laporan akuntansi.
 *
 * `hanyaSampai = true`
 * digunakan untuk laporan titik waktu seperti neraca.
 *
 * Logic dan contract props TIDAK DIUBAH.
 */
export default function PeriodePicker({
    mulai,
    sampai,
    onChange,
    onExport,
    hanyaSampai = false,
    loading = false,
    children,
}) {
    return (
        <div className="mb-4 sm:mb-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex flex-col xl:flex-row xl:items-end gap-3 sm:gap-4">
                {/* =================================================
                    PERIOD LABEL
                ================================================== */}

                <div className="shrink-0">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                            <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                        </div>

                        <div>
                            <p className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white">
                                Periode Laporan
                            </p>

                            <p className="mt-0.5 text-[9px] sm:text-[10px] text-gray-400">
                                {hanyaSampai
                                    ? "Posisi pada satu tanggal"
                                    : "Pilih rentang tanggal laporan"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    DATE CONTROLS & PRESETS
                ================================================== */}

                <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3">
                        {!hanyaSampai && (
                            <>
                                <Field label="Dari tanggal">
                                    <input
                                        type="date"
                                        value={mulai}
                                        onChange={(event) =>
                                            onChange({
                                                mulai: event.target.value,
                                                sampai,
                                            })
                                        }
                                        className={inputClass}
                                    />
                                </Field>

                                <div className="hidden sm:flex h-9 items-center justify-center">
                                    <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                                </div>
                            </>
                        )}

                        <Field label={hanyaSampai ? "Per tanggal" : "Sampai tanggal"}>
                            <input
                                type="date"
                                value={sampai}
                                onChange={(event) =>
                                    onChange({
                                        mulai,
                                        sampai: event.target.value,
                                    })
                                }
                                className={inputClass}
                            />
                        </Field>
                    </div>

                    {!hanyaSampai && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <button
                                type="button"
                                onClick={() => {
                                    const now = new Date();
                                    const year = now.getFullYear();
                                    const month = String(now.getMonth() + 1).padStart(2, "0");
                                    const day = String(now.getDate()).padStart(2, "0");
                                    const today = `${year}-${month}-${day}`;
                                    onChange({ mulai: today, sampai: today });
                                }}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition"
                            >
                                Hari Ini
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const now = new Date();
                                    const year = now.getFullYear();
                                    const month = now.getMonth();
                                    const first = new Date(year, month, 1);
                                    const last = new Date(year, month + 1, 0);
                                    const fmt = (d) =>
                                        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                                    onChange({ mulai: fmt(first), sampai: fmt(last) });
                                }}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition"
                            >
                                Bulan Ini
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const now = new Date();
                                    const year = now.getFullYear();
                                    const month = now.getMonth() - 1;
                                    const first = new Date(year, month, 1);
                                    const last = new Date(year, month + 1, 0);
                                    const fmt = (d) =>
                                        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                                    onChange({ mulai: fmt(first), sampai: fmt(last) });
                                }}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition"
                            >
                                Bulan Lalu
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const year = new Date().getFullYear();
                                    onChange({ mulai: `${year}-01-01`, sampai: `${year}-12-31` });
                                }}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition"
                            >
                                Tahun Ini
                            </button>
                        </div>
                    )}
                </div>

                {/* =================================================
                    ADDITIONAL FILTERS
                ================================================== */}

                {children && (
                    <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3">{children}</div>
                )}

                {/* =================================================
                    ACTION
                ================================================== */}

                <div className="xl:ml-auto w-full sm:w-auto">
                    {onExport && (
                        <button
                            type="button"
                            onClick={onExport}
                            disabled={loading}
                            className="w-full sm:w-auto h-9 px-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[11px] font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5 transition"
                        >
                            <Download
                                className={` w-3.5 h-3.5 ${loading ? "animate-pulse" : ""} `}
                            />

                            {loading ? "Menyiapkan..." : "Export Excel"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ================================================================
   FIELD
================================================================ */

function Field({ label, children }) {
    return (
        <div className="min-w-0">
            <label className="block mb-1.5 text-[9px] uppercase tracking-[0.1em] font-semibold text-gray-400 dark:text-gray-500">
                {label}
            </label>

            {children}
        </div>
    );
}

/* ================================================================
   INPUT
================================================================ */

const inputClass = `
    w-full
    sm:w-[150px]
    h-9
    px-2.5
    sm:px-3
    rounded-lg
    border
    border-gray-200
    dark:border-gray-700
    bg-white
    dark:bg-gray-900
    text-[11px]
    sm:text-xs
    text-gray-900
    dark:text-white
    focus:outline-none
    focus:border-amber-500
    focus:ring-2
    focus:ring-amber-500/10
    transition
`;
