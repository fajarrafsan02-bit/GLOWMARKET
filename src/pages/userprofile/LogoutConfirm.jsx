/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { LogOut, X } from "lucide-react";

export default function LogoutConfirm({ open, loggingOut, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => {
                if (!loggingOut) onCancel();
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700"
            >
                {/* Header */}
                <div className="relative px-6 pt-6 pb-4 text-center">
                    {/* Close */}
                    {!loggingOut && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition"
                            aria-label="Tutup"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}

                    {/* Icon */}
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <LogOut className="w-7 h-7 text-red-500 dark:text-red-400" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Keluar dari Akun?
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                        Anda akan keluar dari akun GlowMarket. Anda dapat login kembali kapan saja.
                    </p>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 pt-2">
                    <div className="flex flex-col-reverse sm:flex-row gap-2.5">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loggingOut}
                            className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Batal
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loggingOut}
                            className="flex-1 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loggingOut ? (
                                <>
                                    <svg
                                        className="w-4 h-4 animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />

                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Keluar...
                                </>
                            ) : (
                                <>
                                    <LogOut className="w-4 h-4" />
                                    Ya, Keluar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
