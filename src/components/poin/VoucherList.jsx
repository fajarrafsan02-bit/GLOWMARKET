import { Check, Copy, Gift } from "lucide-react";

import { formatDateTime, formatPrice } from "../../utils/format.js";

export default function VoucherList({ vouchers, copiedKode, onCopy }) {
    return (
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />

                <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Voucher Saya</h2>
            </div>

            {vouchers.length === 0 ? (
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Belum ada voucher. Tukar poin Anda untuk mendapatkan voucher.
                </p>
            ) : (
                <ul className="space-y-2.5 sm:space-y-3">
                    {vouchers.map((v) => (
                        <li
                            key={v.id}
                            className="flex items-center justify-between gap-2 sm:gap-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-900/10 px-3 py-2.5 sm:px-4 sm:py-3"
                        >
                            <div className="min-w-0">
                                <p className="text-sm sm:text-base font-semibold text-amber-700 dark:text-amber-400">
                                    {formatPrice(v.nilai)}
                                </p>

                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Berlaku s.d. {formatDateTime(v.berlakuSampai)}
                                </p>
                            </div>

                            <button
                                onClick={() => onCopy(v.kode)}
                                className="shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 text-[10px] sm:text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                                title="Salin kode voucher"
                            >
                                {copiedKode === v.kode ? (
                                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                ) : (
                                    <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                )}

                                {copiedKode === v.kode ? "Tersalin" : v.kode}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
