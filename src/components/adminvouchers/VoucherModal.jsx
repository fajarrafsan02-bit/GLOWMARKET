import { X, Loader2 } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import useVoucherForm from "../../hooks/useVoucherForm.js";

const inputCls =
    "w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all";

export default function VoucherModal({ open, onClose, onSaved, editing }) {
    const { form, saving, error, set, setAktif, submit } = useVoucherForm({
        open,
        editing,
        onSaved,
        onClose,
    });

    return (
        <AnimatePresence>
            {open && (
                <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                >
                    <Motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.97 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800"
                    >
                        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                                    {editing ? "Edit Voucher" : "Buat Voucher"}
                                </h2>
                                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Kode diskon untuk pelanggan
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                                        Kode Voucher
                                    </label>
                                    <input
                                        value={form.kode}
                                        onChange={set("kode")}
                                        placeholder="cth: DISKON10"
                                        className={`${inputCls} uppercase`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                                        Jenis Diskon
                                    </label>
                                    <select
                                        value={form.jenis}
                                        onChange={set("jenis")}
                                        className={inputCls}
                                    >
                                        <option value="PERSEN">Persen (%)</option>
                                        <option value="NOMINAL">Nominal (Rp)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                                        Nilai {form.jenis === "PERSEN" ? "Persen (%)" : "Rupiah"}
                                    </label>
                                    <input
                                        type="number"
                                        value={form.nilai}
                                        onChange={set("nilai")}
                                        placeholder="0"
                                        className={inputCls}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                                        Min. Belanja (kosong = tanpa syarat)
                                    </label>
                                    <input
                                        type="number"
                                        value={form.minBelanja}
                                        onChange={set("minBelanja")}
                                        placeholder="0"
                                        className={inputCls}
                                    />
                                </div>

                                {form.jenis === "PERSEN" && (
                                    <div>
                                        <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                                            Maks. Diskon (kosong = tanpa batas)
                                        </label>
                                        <input
                                            type="number"
                                            value={form.maksDiskon}
                                            onChange={set("maksDiskon")}
                                            placeholder="0"
                                            className={inputCls}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                                        Kuota (kosong = tanpa batas)
                                    </label>
                                    <input
                                        type="number"
                                        value={form.kuota}
                                        onChange={set("kuota")}
                                        placeholder="0"
                                        className={inputCls}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                                        Berlaku Dari
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={form.berlakuDari}
                                        onChange={set("berlakuDari")}
                                        className={inputCls}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                                        Berlaku Sampai
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={form.berlakuSampai}
                                        onChange={set("berlakuSampai")}
                                        className={inputCls}
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={form.aktif}
                                    onChange={setAktif}
                                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                                />
                                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                    Voucher aktif
                                </span>
                            </label>

                            {error && (
                                <div className="px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 text-[11px] sm:text-xs text-red-600 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-2 sm:gap-2.5 pt-1">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={saving}
                                    className="flex-1 h-9 sm:h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[11px] sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
                                >
                                    Batal
                                </button>

                                <button
                                    type="button"
                                    onClick={submit}
                                    disabled={saving}
                                    className="flex-[1.5] h-9 sm:h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[11px] sm:text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {saving ? (
                                        <span className="inline-flex items-center gap-1.5 sm:gap-2">
                                            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                            Menyimpan...
                                        </span>
                                    ) : editing ? (
                                        "Simpan Perubahan"
                                    ) : (
                                        "Buat Voucher"
                                    )}
                                </button>
                            </div>
                        </div>
                    </Motion.div>
                </Motion.div>
            )}
        </AnimatePresence>
    );
}
