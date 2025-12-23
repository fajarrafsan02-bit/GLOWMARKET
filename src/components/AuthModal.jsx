import { useState } from "react";
import { X, Eye, EyeOff, CheckCircle } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import api from "../api/Axios.jsx";

export default function AuthModal({ open, onClose, onSuccess }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (mode === "register" && !name.trim()) {
      setError("Nama wajib diisi");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("Email dan password wajib diisi");
      return;
    }

    try {
      if (mode === "register") {
        const res = await api.post(
          "/auth/register",
          {
            namaLengkap: name.trim(),
            email: email.trim(),
            password: password,
            noHp: phone.trim(),
          },
          { headers: { "Content-Type": "application/json" } }
        );
        setNotice(res.data?.message || "Registrasi berhasil! Silakan login.");
        setMode("login");
        setName("");
        setPhone("");
        setPassword("");
      } else {
        const res = await api.post(
          "/auth/login",
          { email: email.trim(), password },
          { headers: { "Content-Type": "application/json" } }
        );

        const token = res.data?.token;
        const user = res.data?.user || {};

        if (!token) throw new Error("Token tidak ditemukan");

        localStorage.setItem("user_token", token);
        if (user.namaLengkap) localStorage.setItem("user_name", user.namaLengkap);
        if (user.email) localStorage.setItem("user_email", user.email);
        if (user.id) localStorage.setItem("user_id", String(user.id));
        if (user.role) localStorage.setItem("user_role", user.role);

        // Trigger user:login event untuk UserPresenceProvider
        console.log("[AuthModal] Triggering user:login event for WebSocket connection");
        window.dispatchEvent(new Event("user:login"));

        setNotice("Login berhasil! Selamat datang kembali ✨");
        onSuccess?.();
        setTimeout(() => onClose?.(), 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan, silakan coba lagi.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <Motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-full max-w-4xl bg-white dark:bg-gray-900/98 rounded-3xl shadow-2xl border border-amber-100 dark:border-yellow-800/50 flex flex-col md:flex-row my-8"
          >
            {/* Left Side - Form (Compact & Tombol Aman) */}
            <div className="flex-1 p-5 md:p-6 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg md:text-xl font-extrabold text-gray-800 dark:text-gray-100">
                  {mode === "login" ? "Masuk Akun" : "Daftar Akun Baru"}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setMode("login")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    mode === "login"
                      ? "bg-linear-to-r from-amber-600 to-yellow-600 text-white shadow"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode("register")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    mode === "register"
                      ? "bg-linear-to-r from-amber-600 to-yellow-600 text-white shadow"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Registrasi
                </button>
              </div>

              <AnimatePresence>
                {notice && (
                  <Motion.div
                    key="notice-message"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className="mb-2 p-2.5 rounded-lg bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    {notice}
                  </Motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <Motion.div
                    key="error-message"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className="mb-2 p-2.5 rounded-lg bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 text-xs"
                  >
                    {error}
                  </Motion.div>
                )}
              </AnimatePresence>

              {/* Form Content - Scrollable jika perlu, tapi jarang */}
              <div className="flex-1 overflow-y-auto pb-2">
                <form onSubmit={submit} className="space-y-3">
                  {mode === "register" && (
                    <Motion.div
                      key="register-name"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm transition"
                        placeholder="Nama Anda"
                      />
                    </Motion.div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm transition"
                      placeholder="email@contoh.com"
                    />
                  </div>

                  {mode === "register" && (
                    <Motion.div
                      key="register-phone"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        No. HP
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm transition"
                        placeholder="+62 8xx xxxx xxxx"
                      />
                    </Motion.div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm transition pr-10"
                        placeholder="Min. 6 karakter"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Tombol Submit - Sticky di bawah */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  onClick={submit}
                  className="w-full py-3 rounded-xl bg-linear-to-r from-amber-600 to-yellow-600 dark:from-amber-500 dark:to-yellow-500 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {mode === "login" ? "Masuk Sekarang" : "Daftar Akun"}
                </Motion.button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                  Dengan melanjutkan, Anda menyetujui{" "}
                  <span className="text-amber-600 dark:text-yellow-400 font-medium">
                    Kebijakan Privasi
                  </span>{" "}
                  kami.
                </p>
              </div>
            </div>

            {/* Right Side - Benefits */}
            <div className="hidden md:flex bg-linear-to-br from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 p-6 border-l border-amber-200 dark:border-yellow-800/40 flex-col justify-center">
              <h4 className="text-base font-bold text-amber-800 dark:text-yellow-400 mb-4">
                Keuntungan Member
              </h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  "Simpan wishlist favorit",
                  "Lacak status pesanan",
                  "Promo eksklusif member",
                  "Checkout lebih cepat",
                ].map((benefit, i) => (
                  <Motion.li
                    key={i}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300"
                  >
                    <CheckCircle className="w-4.5 h-4.5 text-amber-600 dark:text-yellow-500 shrink-0" />
                    {benefit}
                  </Motion.li>
                ))}
              </ul>
              <div className="mt-5 p-3 rounded-lg bg-white/70 dark:bg-gray-800/40 border border-amber-200 dark:border-yellow-700/40">
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  🔒 Aman & terenkripsi 100%
                </p>
              </div>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
