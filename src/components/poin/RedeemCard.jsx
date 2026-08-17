import { useEffect, useRef } from "react";
import { Gift, Loader2, Sparkles } from "lucide-react";

import { formatPrice } from "../../utils/format.js";

export default function RedeemCard({
    jumlahPoin,
    onJumlahPoinChange,
    submitting,
    loading,
    onTukar,
    submitError,
    success,
}) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />

                <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                    Tukar Poin Jadi Voucher
                </h2>
            </div>

            <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-4">
                Voucher berjenis nominal dan hanya dapat dipakai oleh Anda. Masukkan kode voucher
                saat checkout untuk memakai diskon.
            </p>

            <div className="flex items-center gap-2 sm:gap-3">
                <input
                    ref={inputRef}
                    autoFocus
                    type="number"
                    min={100}
                    step={100}
                    value={jumlahPoin}
                    onChange={(e) => onJumlahPoinChange(e.target.value)}
                    placeholder="Contoh: 100"
                    className="flex-1 min-w-0 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                <button
                    onClick={onTukar}
                    disabled={submitting || loading}
                    className="px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 sm:gap-2 shrink-0"
                >
                    {submitting ? (
                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin shrink-0" />
                    ) : (
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    )}
                    Tukar
                </button>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                <span>
                    Nilai voucher:{" "}
                    <strong className="text-gray-900 dark:text-white">
                        {formatPrice(Math.max(0, Number(jumlahPoin) || 0) * 100)}
                    </strong>
                </span>

                <span>Minimal 100 poin</span>
            </div>

            {submitError && (
                <p className="mt-3 text-xs text-red-600 dark:text-red-400">{submitError}</p>
            )}

            {success && (
                <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400">{success}</p>
            )}
        </section>
    );
}
