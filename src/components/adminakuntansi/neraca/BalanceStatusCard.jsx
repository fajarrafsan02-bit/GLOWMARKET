import { AlertTriangle, CheckCircle2, Scale } from "lucide-react";

export default function BalanceStatusCard({ seimbang, sampai }) {
    return (
        <div
            className={` rounded-xl border px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-3 sm:gap-4 ${seimbang ? ` border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-900/10 ` : ` border-rose-200 dark:border-rose-900/40 bg-rose-50/70 dark:bg-rose-900/10 `} `}
        >
            <div className="flex items-center gap-2 sm:gap-3">
                <div
                    className={` w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center ${seimbang ? ` bg-emerald-100 dark:bg-emerald-900/30 ` : ` bg-rose-100 dark:bg-rose-900/30 `} `}
                >
                    {seimbang ? (
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                        <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 dark:text-rose-400" />
                    )}
                </div>

                <div>
                    <p
                        className={` text-xs font-semibold ${seimbang ? ` text-emerald-800 dark:text-emerald-300 ` : ` text-rose-800 dark:text-rose-300 `} `}
                    >
                        {seimbang ? "Neraca Seimbang" : "Neraca Tidak Seimbang"}
                    </p>

                    <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                        Posisi laporan per {sampai}
                    </p>
                </div>
            </div>

            <div
                className={` hidden sm:flex items-center gap-2 text-[10px] font-semibold ${seimbang ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"} `}
            >
                <Scale className="w-3.5 h-3.5" />

                {seimbang ? "Aset = Liabilitas + Ekuitas" : "Perlu pemeriksaan"}
            </div>
        </div>
    );
}
