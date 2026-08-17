import { AlertCircle } from "lucide-react";

export default function CheckoutErrorBanner({ error }) {
    if (!error) return null;

    return (
        <div className="mb-5 p-3.5 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-sm text-red-700 dark:text-red-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

            <span>{error}</span>
        </div>
    );
}
