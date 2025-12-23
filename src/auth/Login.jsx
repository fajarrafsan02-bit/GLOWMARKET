import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/Axios";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) return savedTheme === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        if (isDarkMode) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", { email, password });
            
            if (response.data.success) {
                navigate("/verify-otp", { state: { email } });
            }
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.validationErrors) {
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
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center px-4">
            <div className="relative w-full max-w-md">
                <div className="bg-white/90 dark:bg-black/70 backdrop-blur-lg border border-yellow-400/50 dark:border-yellow-600/40 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4 shadow-lg">
                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L13.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L10.91 8.26L12 2Z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-yellow-700 dark:text-yellow-500">Login</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Fajar Gold Jewelry</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-600/50 rounded-lg text-red-700 dark:text-red-300 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
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
                            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition disabled:opacity-70"
                        >
                            {loading ? "Memproses..." : "Masuk"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Belum punya akun?{" "}
                            <Link to="/register" className="text-yellow-600 hover:text-yellow-700 font-semibold">
                                Daftar
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button
                            type="button"
                            onClick={() => setIsDarkMode(prev => !prev)}
                            className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            {isDarkMode ? "🌞" : "🌙"}
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">© 2025 Fajar Gold Jewelry</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
