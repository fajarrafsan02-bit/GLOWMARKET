import { AlertTriangle } from "lucide-react";

export default function ImbalanceWarning({ selisih }) {
    return (
        <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/10 px-4 py-3">
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                        Neraca tidak seimbang
                    </p>

                    <p className="mt-0.5 text-[10px] leading-relaxed text-rose-700 dark:text-rose-400">
                        Selisih <span className="font-semibold">{selisih}</span>. Ada jurnal yang
                        mungkin masuk di luar jalur pencatatan normal. Periksa kembali halaman Jurnal
                        Umum.
                    </p>
                </div>
            </div>
        </div>
    );
}
