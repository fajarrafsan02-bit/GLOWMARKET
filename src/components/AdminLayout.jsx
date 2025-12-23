import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminHeader from "./AdminHeader.jsx";
import { LogOut } from "lucide-react";
import { motion as Motion } from "framer-motion";

export default function AdminLayout({ title, activeMenu, children }) {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [adminName] = useState(() => {
    return localStorage.getItem("admin_nama") || "Admin";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    
    // Simulate logout delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_nama");
    localStorage.removeItem("admin_email");
    
    setLoggingOut(false);
    navigate("/admin/login");
  };

  useEffect(() => {
    const scriptId = "chartjs-cdn-script";
    if (window.Chart || document.getElementById(scriptId)) return;
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar activeMenu={activeMenu} onLogout={handleLogoutClick} mobileOpen={isSidebarOpen} setMobileOpen={setIsSidebarOpen} />
      <main className="flex-1 md:ml-64">
        <AdminHeader
          title={title}
          isDarkMode={isDarkMode}
          onToggleDark={() => setIsDarkMode(!isDarkMode)}
          adminName={adminName}
          onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
        />
        {children}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="px-6 py-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Konfirmasi Logout</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Anda yakin ingin keluar dari akun admin?</p>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => { setShowLogoutConfirm(false); handleLogout(); }}
                  disabled={loggingOut}
                  className="flex-1 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  {loggingOut ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Keluar...</span>
                    </>
                  ) : (
                    "Ya, Keluar"
                  )}
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={loggingOut}
                  className="flex-1 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Batal
                </button>
              </div>
            </div>
          </Motion.div>
        </div>
      )}
    </div>
  );
}
