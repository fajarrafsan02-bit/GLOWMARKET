import { RefreshCw, Truck } from "lucide-react";

export default function OngkirHeader({ loading, onReload }) {
    return (
        <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                    <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                </div>

                <div>
                    <h2 className="text-[11px] sm:text-sm font-semibold text-gray-900 dark:text-white">
                        Tarif Ongkir
                    </h2>

                    <p className="mt-0.5 text-[9px] sm:text-[10px] text-gray-400">
                        Ongkos kirim per provinsi tujuan pengiriman.
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onReload}
                disabled={loading}
                className="h-8 px-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-[10px] font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
            >
                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                Muat Ulang
            </button>
        </div>
    );
}
