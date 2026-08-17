import { Loader2, Send } from "lucide-react";

import { formatPrice } from "../../utils/format.js";

export default function ReturnForm({
    ordersLoading,
    pesananSelesai,
    pesananId,
    onPesananIdChange,
    alasan,
    onAlasanChange,
    submitting,
    submitError,
    onCancel,
    onSubmit,
}) {
    return (
        <div className="mb-4 sm:mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-5">
            <h2 className="text-[11px] sm:text-sm font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Formulir Pengembalian
            </h2>

            <div className="space-y-3 sm:space-y-4">
                <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Pilih Pesanan
                    </label>

                    <select
                        value={pesananId}
                        onChange={(e) => onPesananIdChange(e.target.value)}
                        className="w-full h-9 sm:h-10 px-2.5 sm:px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
                    >
                        <option value="">-- Pilih pesanan selesai --</option>

                        {ordersLoading ? (
                            <option disabled>Memuat pesanan...</option>
                        ) : pesananSelesai.length === 0 ? (
                            <option disabled>Tidak ada pesanan selesai</option>
                        ) : (
                            pesananSelesai.map((o) => (
                                <option key={o.id} value={o.id}>
                                    #{o.nomorPesanan} • {formatPrice(o.totalHarga)}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Alasan Pengembalian
                    </label>

                    <textarea
                        value={alasan}
                        onChange={(e) => onAlasanChange(e.target.value)}
                        rows={3}
                        placeholder="Misal: barang rusak, ukuran tidak sesuai, salah kirim..."
                        className="w-full px-2.5 sm:px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
                    />
                </div>

                {submitError && (
                    <div className="px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 text-[11px] sm:text-xs text-red-600 dark:text-red-400">
                        {submitError}
                    </div>
                )}

                <div className="flex gap-2 sm:gap-2.5">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        className="flex-1 h-9 sm:h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={submitting}
                        className="flex-[1.5] h-9 sm:h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 inline-flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                        {submitting ? (
                            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                            <>
                                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Kirim Pengajuan
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
