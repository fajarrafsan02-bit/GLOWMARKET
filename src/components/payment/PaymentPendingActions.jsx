import { ExternalLink, RefreshCw } from "lucide-react";

export default function PaymentPendingActions({ paymentData, syncing, errorMsg, onCheck }) {
    const goToInvoice = () => {
        if (!paymentData?.invoiceUrl) return;

        // Tab yang sama (bukan tab baru) — setelah pembayaran selesai, Xendit
        // mengarahkan balik otomatis ke halaman status kita (lihat
        // success_redirect_url / failure_redirect_url di XenditService).
        window.location.href = paymentData.invoiceUrl;
    };

    return (
        <div className="mt-6">
            <button
                type="button"
                onClick={goToInvoice}
                className="w-full h-11 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
            >
                <ExternalLink className="w-4 h-4" />
                Buka Halaman Pembayaran
            </button>

            <button
                type="button"
                onClick={() => onCheck(paymentData?.externalId)}
                disabled={syncing}
                className="w-full h-10 mt-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />

                {syncing ? "Memeriksa..." : "Perbarui Status"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Status diperbarui otomatis
            </div>

            {errorMsg && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 text-center">
                    {errorMsg}
                </div>
            )}
        </div>
    );
}
