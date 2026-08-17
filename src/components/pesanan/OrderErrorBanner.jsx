import { RefreshCw } from "lucide-react";

export default function OrderErrorBanner({ error, onRetry }) {
    if (!error) {
        return null;
    }

    return (
        <div className="mb-6 p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-sm text-red-700 dark:text-red-400 flex items-center justify-between gap-4">
            <span>{error}</span>

            <button
                onClick={onRetry}
                className="shrink-0 inline-flex items-center gap-2 text-xs font-medium hover:text-red-900"
            >
                <RefreshCw className="w-3.5 h-3.5" />
                Coba Lagi
            </button>
        </div>
    );
}
