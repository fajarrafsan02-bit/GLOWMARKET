
import { useState, useRef, useEffect } from "react";
import api from "../api/Axios";

export default function VerifyOtp() {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // Timer state dengan lazy initialization
    const [timeLeft, setTimeLeft] = useState(() => {
        const storedExpiry = localStorage.getItem("otp_expiry");
        const now = Math.floor(Date.now() / 1000);
        
        if (storedExpiry) {
            const expiry = parseInt(storedExpiry, 10);
            const remaining = expiry - now;
            return remaining > 0 ? remaining : 0;
        }
        
        // If no expiry exists, return 0 (shouldn't happen if coming from login)
        return 0;
    });

    // canResend initialized based on timeLeft
    const [canResend, setCanResend] = useState(timeLeft === 0);
    const inputRefs = useRef([]);

    // Initialize dark mode with lazy initialization
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            return savedTheme === "dark";
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    // Apply dark mode to document
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    // Timer countdown logic
    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    // Format waktu ke MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleResend = async () => {
        if (!canResend) return;
        
        setLoading(true);
        setError("");
        
        try {
            const email = localStorage.getItem("temp_admin_email"); 
            
            if (!email) {
                setError("Email tidak ditemukan, silakan login ulang.");
                return;
            }

            await api.post("/auth/kirim-ulang-otp-admin", { email });
            
            // Reset timer
            const now = Math.floor(Date.now() / 1000);
            const expiry = now + 300; // 5 minutes from now
            localStorage.setItem("otp_expiry", expiry.toString());
            setTimeLeft(300);
            setCanResend(false);
            alert("OTP baru telah dikirim ke email Anda.");
            
        } catch (err) {
            setError(err.response?.data?.message || "Gagal mengirim ulang OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const submit = async () => {
        const kode = otp.join("");
        if (kode.length !== 4) {
            setError("Masukkan 4 digit OTP");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await api.post(
                "/auth/verifikasi-otp-admin",
                { kode: kode },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }
            );

            console.log("Response:", res.data);

            if (res.data.success && res.data.token) {
                localStorage.setItem("admin_token", res.data.token);
                localStorage.setItem("admin_nama", res.data.namaLengkap || "");
                localStorage.setItem("admin_email", res.data.email || "");
                
                // Clear OTP expiry and temp email after successful verification
                localStorage.removeItem("otp_expiry");
                localStorage.removeItem("temp_admin_email");
                
                window.location.href = "/admin/dashboard";
            } else {
                setError("Token tidak diterima dari server");
            }
        } catch (err) {
            // Handle different error response formats from backend
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.validationErrors) {
                // Handle validation errors
                const validationErrors = err.response.data.validationErrors;
                const errorMessages = Object.values(validationErrors).join(", ");
                setError(errorMessages);
            } else if (typeof err.response?.data === 'string') {
                setError(err.response.data);
            } else {
                setError("OTP salah atau terjadi kesalahan");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80')] dark:bg-[url('https://images.unsplash.com/photo-1611590029725-9f8e9c8be800?ixlib=rb-4.0.3&auto=format&fit=crop&q=80')] opacity-5 dark:opacity-10 bg-cover bg-center pointer-events-none"></div>

            <div className="relative w-full max-w-sm">
                <div className="bg-white/90 dark:bg-black/70 backdrop-blur-lg border border-yellow-400/50 dark:border-yellow-600/40 rounded-2xl shadow-2xl shadow-yellow-300/40 dark:shadow-yellow-900/60 p-6 md:p-8">
                {/* Logo & Title */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700 rounded-full mb-3 shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L13.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L10.91 8.26L12 2Z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-500 tracking-wide">Verifikasi OTP</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Masukkan kode OTP yang dikirim ke email Anda</p>
                    </div>

                {/* OTP Inputs */}
                <div className="flex gap-3 justify-center mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-12 text-2xl font-bold text-center border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 dark:focus:ring-yellow-800 transition-all outline-none bg-white dark:bg-gray-800/80 text-gray-900 dark:text-white"
                        />
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-600/50 rounded-lg text-red-700 dark:text-red-300 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    onClick={submit}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg text-white dark:text-black font-bold transition-all shadow-lg ${loading
                        ? "bg-yellow-700 dark:bg-yellow-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-500 hover:from-yellow-400 dark:hover:from-yellow-500 dark:hover:to-yellow-400 transform hover:scale-105"
                        }`}
                >
                    {loading ? "Memverifikasi..." : "Verifikasi OTP"}
                </button>

                {/* Resend Link */}
                <div className="text-center mt-5 text-sm text-gray-600 dark:text-gray-400">
                    <p className="mb-2">
                        Waktu tersisa: <span className="font-mono font-bold text-yellow-600">{formatTime(timeLeft)}</span>
                    </p>
                    <p>
                        Tidak menerima kode?{" "}
                        <button 
                            onClick={handleResend}
                            disabled={!canResend || loading}
                            className={`font-medium transition-colors ${
                                canResend 
                                    ? "text-yellow-600 hover:text-yellow-700 hover:underline cursor-pointer" 
                                    : "text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            {loading ? "Mengirim..." : "Kirim ulang"}
                        </button>
                    </p>
                </div>

                {/* Toggle Tema - Ikon Matahari / Bulan */}
                <div className="mt-6 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setIsDarkMode(prev => !prev)}
                        className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md hover:shadow-xl transition-all duration-300 group"
                        aria-label="Ganti tema"
                    >
                        {isDarkMode ? (
                            // Ikon Matahari (light mode)
                            <svg className="w-6 h-6 text-yellow-500 group-hover:rotate-180 transition duration-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            // Ikon Bulan (dark mode)
                            <svg className="w-6 h-6 text-gray-800 group-hover:-rotate-90 transition duration-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">© 2025 Toko Emas Online - Luxury & Elegance</p>
                </div>
            </div>
        </div>
    </div>
    );
}

