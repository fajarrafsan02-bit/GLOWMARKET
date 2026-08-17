import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function useAuthModal({ onClose, onSuccess }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // "login" | "register" | "admin-otp" | "verify-email"
    const [mode, setMode] = useState("login");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(300);
    const [canResend, setCanResend] = useState(false);
    const otpInputRefs = useRef([]);

    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    /*
     * Pengiriman OTP admin lewat SMTP butuh beberapa detik. Tanpa penanda
     * terpisah, layar OTP muncul begitu tombol ditekan sehingga admin
     * mengetikkan kode yang emailnya belum tiba. `sendingOtp` menahan
     * tampilan tetap di form login sampai backend memastikan email terkirim.
     */
    const [sendingOtp, setSendingOtp] = useState(false);

    const isCodeMode = mode === "admin-otp" || mode === "verify-email";

    useEffect(() => {
        if (isCodeMode && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setCanResend(true);
        }
    }, [isCodeMode, timeLeft]);

    useEffect(() => {
        if (isCodeMode) {
            setTimeout(() => {
                otpInputRefs.current[0]?.focus();
            }, 100);
        }
    }, [isCodeMode]);

    const switchMode = (newMode) => {
        setMode(newMode);
        setError("");
        setNotice("");
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleOtpChange = (val, idx) => {
        if (!/^\d*$/.test(val)) return;

        const newOtp = [...otp];
        newOtp[idx] = val;
        setOtp(newOtp);

        if (val && idx < otp.length - 1) {
            otpInputRefs.current[idx + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (e, idx) => {
        if (e.key === "Backspace" && !otp[idx] && idx > 0) {
            otpInputRefs.current[idx - 1]?.focus();
        }
    };

    const handleResendOtp = async () => {
        if (!canResend || loading) return;

        setLoading(true);
        setError("");
        setNotice("");

        try {
            if (mode === "verify-email") {
                await api.post("/auth/kirim-ulang-verifikasi", { email: email.trim() });
                setTimeLeft(900);
                setCanResend(false);
                setOtp(Array(6).fill(""));
                setNotice("Kode verifikasi baru sudah dikirim ke email Anda.");
                return;
            }

            await api.post("/auth/kirim-ulang-otp-admin", { email: email.trim() });
            setTimeLeft(300);
            setCanResend(false);
            setNotice("Kode OTP baru telah dikirimkan ke email Anda.");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Gagal mengirim ulang OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        const kode = otp.join("");

        if (kode.length !== 6) {
            setError("Masukkan 6 digit kode verifikasi dengan lengkap.");
            return;
        }

        setLoading(true);
        setError("");
        setNotice("");

        try {
            await api.post("/auth/verifikasi-email", {
                email: email.trim(),
                kode,
            });

            setNotice("Email berhasil diverifikasi. Silakan login.");
            setOtp(["", "", "", ""]);
            setPassword("");

            setTimeout(() => switchMode("login"), 900);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Kode verifikasi salah.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const kode = otp.join("");

        if (kode.length !== 4) {
            setError("Masukkan 4 digit kode OTP dengan lengkap.");
            return;
        }

        setLoading(true);
        setError("");
        setNotice("");

        try {
            const res = await api.post("/auth/verifikasi-otp-admin", { kode });

            if (res.data?.success) {
                await login();
                setNotice("Verifikasi OTP Berhasil! Mengalihkan ke Halaman Admin...");

                setTimeout(() => {
                    onClose?.();
                    navigate("/admin/dashboard");
                }, 600);
            } else {
                setError("Verifikasi OTP gagal.");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Kode OTP salah atau terjadi kesalahan.",
            );
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async (credential) => {
        if (loading) return;

        setError("");
        setNotice("");
        setLoading(true);

        try {
            const res = await api.post("/auth/google", { credential });

            /*
             * Akun admin tidak langsung mendapat sesi: backend hanya
             * mengirim OTP ke emailnya, jadi layar pindah ke verifikasi
             * kode seperti alur login admin biasa.
             */
            if (res.data?.butuhOtpAdmin) {
                setEmail(res.data?.email || "");
                setMode("admin-otp");
                setOtp(["", "", "", ""]);
                setTimeLeft(300);
                setCanResend(false);
                setNotice(
                    `Akun admin terdeteksi. Kode OTP 4 digit sudah dikirim ke ${res.data?.email || "email Anda"}.`,
                );
                return;
            }

            await login();
            setNotice("Login berhasil. Selamat datang!");
            onSuccess?.();

            const kembaliKe = location.state?.from?.pathname;

            setTimeout(() => {
                onClose?.();
                if (kembaliKe && kembaliKe !== "/" && kembaliKe !== location.pathname) {
                    navigate(kembaliKe, { replace: true });
                }
            }, 800);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Login dengan Google gagal. Silakan coba lagi.",
            );
        } finally {
            setLoading(false);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setError("");
        setNotice("");

        if (mode === "register" && !name.trim()) {
            setError("Nama lengkap wajib diisi.");
            return;
        }

        if (!email.trim() || !password.trim()) {
            setError("Email dan password wajib diisi.");
            return;
        }

        if (mode === "register" && !phone.trim()) {
            setError("Nomor HP wajib diisi.");
            return;
        }

        setLoading(true);

        try {
            if (mode === "register") {
                const res = await api.post("/auth/register", {
                    namaLengkap: name.trim(),
                    email: email.trim(),
                    password,
                    noHp: phone.trim(),
                });

                setNotice(res.data?.message || `Kode verifikasi dikirim ke ${email.trim()}`);
                setOtp(Array(6).fill(""));
                setTimeLeft(900);
                setCanResend(false);
                setMode("verify-email");
                setName("");
                setPhone("");
                setPassword("");
            } else {
                /*
                 * Backend mengirim OTP admin secara sinkron, jadi respons ini
                 * baru datang setelah emailnya benar-benar terkirim. Selama
                 * menunggu, tombol menampilkan "Mengirim kode OTP..." dan
                 * layar OTP belum dibuka.
                 */
                setSendingOtp(true);

                const res = await api.post("/auth/login", {
                    email: email.trim(),
                    password,
                });

                const user = res.data?.user;

                if (!user) {
                    setMode("admin-otp");
                    setOtp(["", "", "", ""]);
                    setTimeLeft(300);
                    setCanResend(false);
                    setNotice(
                        `Kode OTP 4 digit sudah dikirim ke ${email.trim()}. Periksa email Anda.`,
                    );
                    return;
                }

                await login();
                setNotice("Login berhasil. Selamat datang kembali!");
                onSuccess?.();

                const kembaliKe = location.state?.from?.pathname;

                setTimeout(() => {
                    onClose?.();
                    if (kembaliKe && kembaliKe !== "/" && kembaliKe !== location.pathname) {
                        navigate(kembaliKe, { replace: true });
                    }
                }, 800);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Terjadi kesalahan. Silakan coba lagi.",
            );
        } finally {
            setSendingOtp(false);
            setLoading(false);
        }
    };

    return {
        mode,
        setMode,
        isCodeMode,
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        phone,
        setPhone,
        otp,
        timeLeft,
        canResend,
        otpInputRefs,
        error,
        notice,
        showPassword,
        setShowPassword,
        loading,
        sendingOtp,
        switchMode,
        formatTime,
        handleOtpChange,
        handleOtpKeyDown,
        handleResendOtp,
        handleVerifyEmail,
        handleVerifyOtp,
        loginWithGoogle,
        submit,
    };
}
