import { Link } from "react-router-dom";

const mobileLinks = [
    { to: "/", label: "Beranda" },
    { to: "/katalog", label: "Katalog" },
    { to: "/wishlist", label: "Wishlist Saya" },
    { to: "/chat", label: "Pesan / Chat" },
    { to: "/pesanan", label: "Pesanan Saya" },
    { to: "/poin", label: "Poin Saya" },
    { to: "/pengembalian", label: "Pengembalian" },
    { to: "/tentang", label: "Tentang Kami" },
];

export default function HeaderMobileMenu({
    pathname,
    isLoggedIn,
    handleAuthShow,
    setMobileMenuOpen,
}) {
    const isActive = (to) => {
        if (to === "/") return pathname === "/";
        return pathname.startsWith(to);
    };

    const handleClick = (e, to) => {
        if (
            (to === "/pesanan" || to === "/poin" || to === "/pengembalian") &&
            !isLoggedIn
        ) {
            e.preventDefault();
            if (handleAuthShow) handleAuthShow(true);
            if (setMobileMenuOpen) setMobileMenuOpen(false);
            return;
        }

        if (setMobileMenuOpen) {
            setMobileMenuOpen(false);
        }
    };

    return (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-xl border-t border-gray-100 dark:border-gray-800 z-40">
            <nav className="p-3 space-y-1">
                {mobileLinks.map(({ to, label }) => {
                    const active = isActive(to);

                    return (
                        <Link
                            key={to}
                            to={to}
                            onClick={(e) => handleClick(e, to)}
                            className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-semibold" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                        >
                            <span>{label}</span>
                            {active && (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
