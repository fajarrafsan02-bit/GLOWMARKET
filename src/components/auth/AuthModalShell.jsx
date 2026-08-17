import { X, ShieldAlert } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import useStoreSettings from "../../hooks/useStoreSettings.js";

export default function AuthModalShell({
    open,
    onClose,
    isCodeMode,
    mode,
    email,
    children,
}) {
    const store = useStoreSettings();
    const title =
        mode === "admin-otp"
            ? "Verifikasi OTP Admin"
            : mode === "verify-email"
              ? "Verifikasi Email Anda"
              : mode === "login"
                ? `Masuk ke ${store.name}`
                : `Buat Akun ${store.name}`;

    const subtitle =
        mode === "admin-otp"
            ? `Masukkan 4 digit kode OTP yang telah dikirim ke ${email}`
            : mode === "verify-email"
              ? `Masukkan 6 digit kode yang kami kirim ke ${email}. Verifikasi ini diperlukan agar bukti pembayaran dan status pesanan bisa kami kirim.`
              : mode === "login"
                ? "Masuk untuk melanjutkan pengalaman belanja Anda."
                : "Daftar untuk menyimpan wishlist dan melihat pesanan Anda.";

    return (
        <AnimatePresence>
            {open && (
                <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
                >
                    <Motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                            scale: 0.97,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 15,
                            scale: 0.97,
                        }}
                        transition={{
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-[380px] bg-white dark:bg-gray-950 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 my-auto"
                    >
                        {/* CLOSE BUTTON */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Tutup"
                            className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* HEADER */}
                        <div className="px-3.5 xs:px-5 pt-3.5 xs:pt-5 pb-2 xs:pb-3 text-center">
                            {isCodeMode ? (
                                <div className="w-9 h-9 xs:w-10 xs:h-10 mx-auto mb-2 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                                    <ShieldAlert className="w-4 h-4 xs:w-5 xs:h-5" />
                                </div>
                            ) : (
                                <img
                                    src="/logo.png"
                                    alt={store.name}
                                    className="h-8 xs:h-12 w-auto max-w-[130px] xs:max-w-[170px] mx-auto mb-2 object-contain"
                                />
                            )}

                            <h2 className="text-base xs:text-lg font-bold text-gray-900 dark:text-white">
                                {title}
                            </h2>

                            <p className="mt-0.5 text-[10px] xs:text-xs leading-3.5 xs:leading-4 text-gray-500 dark:text-gray-400">
                                {subtitle}
                            </p>
                        </div>

                        {children}
                    </Motion.div>
                </Motion.div>
            )}
        </AnimatePresence>
    );
}
