import { RefreshCw } from "lucide-react";
import { motion as Motion } from "framer-motion";

export default function AuthCodeForm({
    mode,
    otp,
    timeLeft,
    canResend,
    loading,
    otpInputRefs,
    formatTime,
    onOtpChange,
    onOtpKeyDown,
    onResendOtp,
    onSubmit,
    onBackToLogin,
}) {
    return (
        <form
            onSubmit={onSubmit}
            className="px-4 xs:px-6 pt-4 pb-5 space-y-4"
        >
            {/* CODE INPUTS */}
            <div className="flex gap-1.5 xs:gap-2.5 sm:gap-3 justify-center">
                {otp.map((digit, idx) => (
                    <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => onOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => onOtpKeyDown(e, idx)}
                        className="w-9 h-9 xs:w-11 xs:h-11 sm:w-12 sm:h-12 text-lg xs:text-xl sm:text-2xl font-bold text-center border-2 border-gray-300 dark:border-gray-700 rounded-lg sm:rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                ))}
            </div>

            {/* COUNTDOWN & RESEND */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-1.5">
                <p>
                    Waktu tersisa:{" "}
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        {formatTime(timeLeft)}
                    </span>
                </p>

                <button
                    type="button"
                    onClick={onResendOtp}
                    disabled={!canResend || loading}
                    className={`inline-flex items-center gap-1 font-semibold transition-colors ${
                        canResend
                            ? "text-amber-600 hover:text-amber-700 dark:text-amber-400 cursor-pointer"
                            : "text-gray-400 cursor-not-allowed"
                    }`}
                >
                    <RefreshCw className="w-3 h-3" />
                    {loading
                        ? "Mengirim..."
                        : mode === "verify-email"
                          ? "Kirim ulang kode"
                          : "Kirim ulang OTP"}
                </button>
            </div>

            {/* VERIFY SUBMIT BUTTON */}
            <Motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full h-11 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        Memverifikasi...
                    </span>
                ) : mode === "verify-email" ? (
                    "Verifikasi Email"
                ) : (
                    "Verifikasi & Masuk Admin"
                )}
            </Motion.button>

            <button
                type="button"
                onClick={onBackToLogin}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
            >
                ← Kembali ke Login
            </button>
        </form>
    );
}
