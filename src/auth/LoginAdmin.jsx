import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Axios";

export default function LoginAdmin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    useEffect(() => {
        const onKey = (e) => {
            if (e.altKey && (e.key === "4" || e.code === "Digit4")) {
                e.preventDefault();
                navigate("/", { replace: true });
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [navigate]);

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login-admin", {
                email,
                password,
            });
            
            if (response.data.success) {
                // Set OTP expiry time (5 minutes from now)
                const now = Math.floor(Date.now() / 1000);
                const expiry = now + 300; // 5 minutes
                localStorage.setItem("otp_expiry", expiry.toString());
                localStorage.setItem("temp_admin_email", email);
                
                navigate("/admin/verify-otp", { state: { email } });
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
                setError("Login gagal. Silakan coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

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
                        <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-500 tracking-wide">Admin Login</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Toko Emas Premium</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-600/50 rounded-lg text-red-700 dark:text-red-300 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Admin
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="admin@tokoemas.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-500 hover:from-yellow-400 dark:hover:from-yellow-500 dark:hover:to-yellow-400 text-white dark:text-black font-bold rounded-lg shadow-lg transform hover:scale-105 transition disabled:opacity-70"
                        >
                            {loading ? "Memproses..." : "Masuk"}
                        </button>
                    </form>

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
