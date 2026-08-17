import { Ban, CheckCircle, Loader2 } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import { isCustomerActive } from "../../utils/customer.js";

export default function ToggleStatusModal({ customer, loading, onClose, onConfirm }) {
    if (!customer) {
        return null;
    }

    const customerName = customer.nama || customer.name || "Pelanggan";

    const isActive = isCustomerActive(customer);

    const willActivate = !isActive;

    return (
        <AnimatePresence>
            {customer && (
                <Motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    onClick={loading ? undefined : onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-sm"
                >
                    <Motion.div
                        initial={{
                            opacity: 0,
                            y: 12,
                            scale: 0.98,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 8,
                            scale: 0.98,
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                        onClick={(event) => event.stopPropagation()}
                        className="w-full max-w-sm rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden"
                    >
                        <div className="px-5 pt-5 flex items-start gap-3">
                            <div
                                className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${
                                    willActivate
                                        ? "bg-emerald-50 dark:bg-emerald-900/20"
                                        : "bg-red-50 dark:bg-red-900/20"
                                }`}
                            >
                                {willActivate ? (
                                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                    <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {willActivate ? "Aktifkan User?" : "Nonaktifkan User?"}
                                </h3>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Yakin ingin{" "}
                                    {willActivate ? "mengaktifkan" : "menonaktifkan"}{" "}
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                        {customerName}
                                    </span>
                                    ?
                                </p>

                                {!willActivate && (
                                    <p className="mt-1.5 text-[10px] text-red-500 dark:text-red-400">
                                        User yang dinonaktifkan tidak dapat login ke akun.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-5 px-5 py-3.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-950/40 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="h-9 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={loading}
                                className={`h-9 px-4 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 disabled:opacity-50 transition ${
                                    willActivate
                                        ? "bg-emerald-500 hover:bg-emerald-600"
                                        : "bg-red-500 hover:bg-red-600"
                                }`}
                            >
                                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}

                                {loading
                                    ? "Memproses..."
                                    : willActivate
                                      ? "Aktifkan User"
                                      : "Nonaktifkan User"}
                            </button>
                        </div>
                    </Motion.div>
                </Motion.div>
            )}
        </AnimatePresence>
    );
}
