import { motion as Motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

/**
 * Overlay penuh layar saat invoice sedang dibuat & sebelum redirect ke
 * Xendit — tanpa ini, jeda create-invoice + redirect terasa seperti tombol
 * tidak merespons (pelanggan mengeklik berkali-kali).
 */
export default function CheckoutRedirecting({ show, methodLabel }) {
    return (
        <AnimatePresence>
            {show && (
                <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm"
                >
                    <div className="text-center px-4">
                        <div className="w-12 h-12 mx-auto rounded-full border-4 border-gray-200 dark:border-gray-800 border-t-amber-500 animate-spin" />

                        <p className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                            Menyiapkan pembayaran{methodLabel ? ` ${methodLabel}` : ""}...
                        </p>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Mohon tunggu, Anda akan diarahkan ke halaman pembayaran.
                        </p>

                        <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-gray-400">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Jangan tutup atau muat ulang halaman ini
                        </div>
                    </div>
                </Motion.div>
            )}
        </AnimatePresence>
    );
}
