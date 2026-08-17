import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

import useStoreSettings from "../../hooks/useStoreSettings.js";

const navLinks = [
    {
        to: "/",
        label: "Beranda",
    },
    {
        to: "/katalog",
        label: "Katalog",
    },
    {
        to: "/pesanan",
        label: "Pesanan",
    },
    {
        to: "/poin",
        label: "Poin Saya",
    },
    {
        to: "/pengembalian",
        label: "Pengembalian",
    },
    {
        to: "/tentang",
        label: "Tentang",
    },
];

export default function HeaderNav({
    mobileMenuOpen,
    setMobileMenuOpen,
    pathname,
    isLoggedIn,
    handleAuthShow,
}) {
    const store = useStoreSettings();

    const isActive = (path) => {
        if (path === "/") {
            return pathname === "/";
        }

        return pathname.startsWith(path);
    };

    const handleNavClick = (e, to) => {
        if ((to === "/pesanan" || to === "/poin" || to === "/pengembalian") && !isLoggedIn) {
            e.preventDefault();
            if (handleAuthShow) {
                handleAuthShow(true);
            }
            if (setMobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        }
    };

    return (
        <>
            {/* =====================================================
                LEFT SIDE — MOBILE MENU + LOGO
            ====================================================== */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                {/* Mobile Menu */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
                    aria-expanded={mobileMenuOpen}
                    className="md:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {/* Logo */}
                <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center shrink-0 py-0.5"
                    aria-label={`${store.name} - Beranda`}
                >
                    <img
                        src={store.logo || "/logo.png"}
                        alt={store.name}
                        className="h-7 xs:h-9 sm:h-14 w-auto max-w-[85px] xs:max-w-[140px] sm:max-w-[210px] object-contain"
                    />
                </Link>
            </div>

            {/* =====================================================
                DESKTOP NAV
            ====================================================== */}
            <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-0.5 ml-6">
                {navLinks.map((link) => {
                    const active = isActive(link.to);

                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={(e) => handleNavClick(e, link.to)}
                            className={` relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${active ? "text-amber-600 dark:text-amber-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"} `}
                        >
                            {link.label}

                            {/* Active Indicator */}
                            {active && (
                                <span className="absolute left-3.5 right-3.5 bottom-0 h-0.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
