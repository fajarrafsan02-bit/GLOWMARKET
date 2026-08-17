import { AlertCircle, CheckCircle2, Loader2, Truck } from "lucide-react";

/**
 * Tombol untuk memajukan tahap tracking kurir secara manual (simulasi/demo).
 * Hanya relevan untuk pesanan yang sudah dikirim atau selesai.
 */
export default function TrackingAdvance({ onAdvance, loading, notice }) {
    return (
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                        Tracking Kurir
                    </p>
                    <p className="text-[11px] text-indigo-600/70 dark:text-indigo-400/60 mt-0.5">
                        Majukan tahap pengiriman secara manual (simulasi).
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onAdvance}
                    disabled={loading}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                >
                    {loading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <Truck className="w-3.5 h-3.5" />
                    )}
                    Lanjutkan
                </button>
            </div>

            {notice?.message && (
                <div
                    className={`mt-2.5 flex items-start gap-1.5 text-[11px] ${
                        notice.type === "success"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                    }`}
                >
                    {notice.type === "success" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-px" />
                    ) : (
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />
                    )}
                    <span>{notice.message}</span>
                </div>
            )}
        </div>
    );
}
