import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../utils/theme.js";
import useHeaderData from "../hooks/useHeaderData.js";

import AuthModal from "./AuthModal.jsx";
import HeaderMarquee from "./header/HeaderMarquee.jsx";
import HeaderNav from "./header/HeaderNav.jsx";
import HeaderNotifications from "./header/HeaderNotifications.jsx";
import HeaderActions from "./header/HeaderActions.jsx";
import HeaderMobileMenu from "./header/HeaderMobileMenu.jsx";

export default function Header({ setShowAuth }) {
    const { isAuthenticated: isLoggedIn, user, loading } = useAuth();

    const {
        cartCount,
        wishlistCount,
        chatUnreadCount,
        notificationCount,
        notifications,
        showNotifications,
        setShowNotifications,
        notificationRef,
        fetchCartCount,
        fetchWishlistCount,
        fetchNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
    } = useHeaderData(isLoggedIn, user?.id);

    const { isDark, toggle: toggleTheme } = useTheme();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [localShowAuth, setLocalShowAuth] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname || "/";

    const [lastPathname, setLastPathname] = useState(pathname);
    if (lastPathname !== pathname) {
        setLastPathname(pathname);
        setMobileMenuOpen(false);
        setShowNotifications(false);
    }

    const handleAuthShow = (show) => {
        if (setShowAuth) {
            setShowAuth(show);
        } else {
            setLocalShowAuth(show);
        }
    };

    useEffect(() => {
        const handleOpenAuth = () => {
            handleAuthShow(true);
        };
        window.addEventListener("auth:open", handleOpenAuth);
        return () => window.removeEventListener("auth:open", handleOpenAuth);
    }, [setShowAuth]);

    useEffect(() => {
        if (!loading && location.state?.openAuthModal && !isLoggedIn) {
            const tujuan = location.state.from;
            const timer = setTimeout(() => {
                handleAuthShow(true);
                // Hapus pemicu modal, tapi simpan halaman asal supaya setelah
                // login user kembali ke checkout — bukan tertahan di home.
                navigate(".", {
                    replace: true,
                    state: tujuan ? { from: tujuan } : {},
                });
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [loading, location.state, isLoggedIn, navigate]);

    return (
        <header className="sticky top-0 z-50">
            <HeaderMarquee
                messages={[
                    "Gratis ongkir seluruh Indonesia",
                    "Stok ready",
                    "Garansi uang kembali",
                    "Bisa tukar tambah",
                    "Emas murni bersertifikat",
                ]}
            />

            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                    <div className="flex items-center justify-between gap-4">
                        <HeaderNav
                            mobileMenuOpen={mobileMenuOpen}
                            setMobileMenuOpen={setMobileMenuOpen}
                            pathname={pathname}
                            isLoggedIn={isLoggedIn}
                            handleAuthShow={handleAuthShow}
                            navigate={navigate}
                        />

                        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto md:ml-0">
                            <HeaderNotifications
                                notificationRef={notificationRef}
                                showNotifications={showNotifications}
                                setShowNotifications={setShowNotifications}
                                isLoggedIn={isLoggedIn}
                                notificationCount={notificationCount}
                                notifications={notifications}
                                markAllNotificationsAsRead={markAllNotificationsAsRead}
                                markNotificationAsRead={markNotificationAsRead}
                                fetchNotifications={fetchNotifications}
                                navigate={navigate}
                            />

                            <HeaderActions
                                isLoggedIn={isLoggedIn}
                                pathname={pathname}
                                chatUnreadCount={chatUnreadCount}
                                wishlistCount={wishlistCount}
                                cartCount={cartCount}
                                fetchCartCount={fetchCartCount}
                                isDark={isDark}
                                toggleTheme={toggleTheme}
                                handleAuthShow={handleAuthShow}
                                navigate={navigate}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <HeaderMobileMenu
                    pathname={pathname}
                    isLoggedIn={isLoggedIn}
                    handleAuthShow={handleAuthShow}
                    navigate={navigate}
                    setMobileMenuOpen={setMobileMenuOpen}
                />
            )}

            {!setShowAuth && (
                <AuthModal
                    open={localShowAuth}
                    onClose={() => setLocalShowAuth(false)}
                    onSuccess={() => {
                        fetchCartCount();
                        fetchWishlistCount();
                        fetchNotifications();
                    }}
                />
            )}
        </header>
    );
}
