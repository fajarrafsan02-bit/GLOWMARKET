import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import useStoreSettings from "../../hooks/useStoreSettings.js";

function FormField({ id, label, children }) {
    return (
        <div>
            <label
                htmlFor={id}
                className="block mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-300"
            >
                {label}
            </label>

            {children}
        </div>
    );
}

export default function AuthFieldsForm({
    mode,
    name,
    onNameChange,
    email,
    onEmailChange,
    phone,
    onPhoneChange,
    password,
    onPasswordChange,
    showPassword,
    onTogglePassword,
    loading,
    sendingOtp,
    onSubmit,
}) {
    const store = useStoreSettings();

    return (
        <form onSubmit={onSubmit} className="px-3.5 xs:px-5 pt-3 pb-4 space-y-2.5">
            {/* Name */}
            <AnimatePresence mode="popLayout">
                {mode === "register" && (
                    <Motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <FormField id="auth-name" label="Nama Lengkap">
                            <input
                                id="auth-name"
                                type="text"
                                autoComplete="name"
                                value={name}
                                onChange={onNameChange}
                                placeholder="Masukkan nama lengkap"
                                className="w-full h-9.5 xs:h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs xs:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition"
                            />
                        </FormField>
                    </Motion.div>
                )}
            </AnimatePresence>

            {/* Email */}
            <FormField id="auth-email" label="Email">
                <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={onEmailChange}
                    placeholder="email@contoh.com"
                    className="w-full h-9.5 xs:h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs xs:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition"
                />
            </FormField>

            {/* Phone */}
            <AnimatePresence mode="popLayout">
                {mode === "register" && (
                    <Motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <FormField id="auth-phone" label="Nomor HP">
                            <input
                                id="auth-phone"
                                type="tel"
                                autoComplete="tel"
                                value={phone}
                                onChange={onPhoneChange}
                                placeholder="+62 8xx xxxx xxxx"
                                className="w-full h-9.5 xs:h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs xs:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition"
                            />
                        </FormField>
                    </Motion.div>
                )}
            </AnimatePresence>

            {/* Password */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label
                        htmlFor="auth-password"
                        className="text-[11px] xs:text-xs font-medium text-gray-700 dark:text-gray-300"
                    >
                        Password
                    </label>

                    {mode === "login" && (
                        <button
                            type="button"
                            className="text-[10px] xs:text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors"
                            onClick={() => {}}
                        >
                            Lupa password?
                        </button>
                    )}
                </div>

                <div className="relative">
                    <input
                        id="auth-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                        value={password}
                        onChange={onPasswordChange}
                        placeholder={
                            mode === "register" ? "Minimal 6 karakter" : "Masukkan password"
                        }
                        className="w-full h-9.5 xs:h-10 px-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs xs:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition"
                    />

                    <button
                        type="button"
                        onClick={onTogglePassword}
                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
                    >
                        {showPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                            <Eye className="w-3.5 h-3.5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Submit */}
            <Motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full h-9.5 xs:h-10 mt-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs xs:text-sm font-semibold transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        {sendingOtp ? "Mengirim kode OTP..." : "Memproses..."}
                    </span>
                ) : mode === "login" ? (
                    "Masuk"
                ) : (
                    "Daftar"
                )}
            </Motion.button>

            {/* Menjelaskan kenapa proses login admin terasa lebih lama */}
            {sendingOtp && (
                <p className="text-[10px] leading-4 text-center text-amber-600 dark:text-amber-400">
                    Akun admin terdeteksi. Sedang mengirim kode OTP ke email Anda, mohon tunggu.
                </p>
            )}

            {/* Privacy */}
            <p className="text-[9px] xs:text-[10px] leading-4 text-center text-gray-400 dark:text-gray-500">
                Dengan melanjutkan, Anda menyetujui Kebijakan Privasi dan ketentuan penggunaan{" "}
                {store.name}.
            </p>

            {/* Security */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-1 text-[9px] xs:text-[10px] text-gray-400">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Informasi akun Anda dilindungi</span>
            </div>
        </form>
    );
}
