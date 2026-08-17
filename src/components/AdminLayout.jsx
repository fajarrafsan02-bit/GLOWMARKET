import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminHeader from "./AdminHeader.jsx";

import { LogOut, X } from "lucide-react";

import { motion as Motion } from "framer-motion";

import { useAuth } from "../context/AuthContext.jsx";

export default function AdminLayout({ title, activeMenu, children }) {
    const navigate = useNavigate();
    const { user, isAdmin, logout } = useAuth();

    const adminName = user?.namaLengkap || "Admin";

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const [loggingOut, setLoggingOut] = useState(false);

    // Lapis kedua di luar RequireAdmin (yang sudah menjaga rute ini) —
    // dibiarkan sebagai jaring pengaman kalau komponen ini suatu saat dipakai
    // di luar rute yang dijaga.
    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
        }
    }, [isAdmin, navigate]);

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            await logout();
            setShowLogoutConfirm(false);
            navigate("/", { replace: true });
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f7f8] dark:bg-gray-950 text-gray-900 dark:text-white">
            <AdminSidebar
                activeMenu={activeMenu}
                onLogout={() => setShowLogoutConfirm(true)}
                mobileOpen={isSidebarOpen}
                setMobileOpen={setIsSidebarOpen}
            />

            <main className="min-h-screen md:ml-64">
                <AdminHeader
                    title={title}
                    adminName={adminName}
                    onToggleSidebar={() => setIsSidebarOpen((value) => !value)}
                />

                {children}
            </main>

            {/* =====================================================
                LOGOUT
            ====================================================== */}

            {showLogoutConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    onClick={() => {
                        if (!loggingOut) {
                            setShowLogoutConfirm(false);
                        }
                    }}
                >
                    <Motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.96,
                            y: 8,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        onClick={(event) => event.stopPropagation()}
                        className="w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl"
                    >
                        <div className="p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 shrink-0 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                                    <LogOut className="w-5 h-5 text-red-500" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                            Keluar dari Admin
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() => setShowLogoutConfirm(false)}
                                            disabled={loggingOut}
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                                        Anda yakin ingin keluar dari dashboard admin?
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowLogoutConfirm(false)}
                                    disabled={loggingOut}
                                    className="flex-1 h-10 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                                >
                                    Batal
                                </button>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="flex-1 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {loggingOut ? (
                                        <>
                                            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                            Keluar...
                                        </>
                                    ) : (
                                        <>
                                            <LogOut className="w-4 h-4" />
                                            Keluar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </Motion.div>
                </div>
            )}
        </div>
    );
}
