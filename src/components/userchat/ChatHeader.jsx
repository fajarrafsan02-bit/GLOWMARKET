import { Store, ShieldCheck } from "lucide-react";

import useStoreSettings from "../../hooks/useStoreSettings.js";

/**
 * `isConnected` adalah status sambungan WebSocket peramban ini, bukan
 * keberadaan admin. Karena itu labelnya menyebut "Terhubung", bukan
 * "Customer Service Online" — di luar jam kerja pesan tetap masuk dan
 * dijawab sementara oleh balasan otomatis.
 */
export default function ChatHeader({ isConnected }) {
    const store = useStoreSettings();

    return (
        <div className="h-16 px-4 sm:px-5 flex items-center justify-between bg-white dark:bg-gray-900">
            {/* =====================================================
                STORE INFO
            ====================================================== */}
            <div className="flex items-center gap-3 min-w-0">
                {/* Avatar / Store Logo */}
                <div className="relative w-10 h-10 shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Store className="w-5 h-5 text-amber-600 dark:text-amber-400" />

                    {/* Online indicator */}
                    <span
                        className={` absolute right-0 bottom-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${isConnected ? "bg-emerald-500" : "bg-amber-400"} `}
                    />
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h1 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {store.name}
                        </h1>

                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                            className={` w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-amber-400"} `}
                        />

                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            {isConnected
                                ? "Terhubung · pesan Anda akan kami balas"
                                : "Menghubungkan..."}
                        </p>
                    </div>
                </div>
            </div>

            {/* =====================================================
                RIGHT STATUS
            ====================================================== */}
            <div
                className={` hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium ${isConnected ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"} `}
            >
                {isConnected ? "Terhubung" : "Menghubungkan"}
            </div>
        </div>
    );
}
