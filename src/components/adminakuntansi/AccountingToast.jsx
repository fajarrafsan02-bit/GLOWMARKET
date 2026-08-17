import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function AccountingToast({ toast }) {
    if (!toast) {
        return null;
    }

    return (
        <div
            className={`mb-4 flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium ${
                toast.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                    : "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400"
            }`}
        >
            {toast.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            {toast.message}
        </div>
    );
}
