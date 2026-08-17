import { MessageCircle, Heart, LogIn, UserCheck, ShoppingBag } from "lucide-react";

export default function HeaderActions({
    isLoggedIn,
    pathname,
    chatUnreadCount,
    wishlistCount,
    cartCount,
    fetchCartCount,
    handleAuthShow,
    navigate,
}) {
    const isActive = (path) => pathname.startsWith(path);

    const handleProtectedNavigation = (path) => {
        if (isLoggedIn) {
            navigate(path);
        } else {
            handleAuthShow(true);
        }
    };

    const badge = (count) => {
        if (!count || count <= 0) return null;

        return (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-950">
                {count > 99 ? "99+" : count}
            </span>
        );
    };

    const actionButton = (active = false) =>
        `
      relative w-8 h-8 sm:w-9 sm:h-9
      rounded-lg
      flex items-center justify-center
      transition-all duration-200
      ${
          active
              ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
      }
    `;

    return (
        <div className="flex items-center gap-0.5 sm:gap-1.5">
            {/* Chat */}
            <button
                type="button"
                onClick={() => handleProtectedNavigation("/chat")}
                className={`hidden sm:flex ${actionButton(isActive("/chat"))}`}
                aria-label="Chat"
                title="Pesan / Chat"
            >
                <MessageCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                {badge(chatUnreadCount)}
            </button>

            {/* Wishlist */}
            <button
                type="button"
                onClick={() => handleProtectedNavigation("/wishlist")}
                className={`flex ${actionButton(isActive("/wishlist"))}`}
                aria-label="Wishlist"
                title="Wishlist / Favorit"
            >
                <Heart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                {badge(wishlistCount)}
            </button>

            {/* Profil bila sudah masuk, ajakan login bila belum.
                Sebelumnya keduanya sama-sama ikon orang berwarna amber
                sehingga status masuk/belum tidak terbaca sekilas. */}
            {isLoggedIn ? (
                <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className={actionButton(isActive("/profile"))}
                    aria-label="Akun Saya"
                    title="Akun Saya"
                >
                    <UserCheck className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-amber-600 dark:text-amber-400" />
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => handleAuthShow(true)}
                    className="flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg border border-amber-500 text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20 transition-all duration-200 active:scale-95"
                    aria-label="Masuk ke akun"
                    title="Masuk ke akun"
                >
                    <LogIn className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    {/* Teks disembunyikan di layar sempit supaya deretan
                        tombol lain tidak terdesak keluar. */}
                    <span className="hidden sm:inline text-xs font-semibold">Masuk</span>
                </button>
            )}

            {/* Cart */}
            <button
                type="button"
                onClick={() => {
                    if (!isLoggedIn) {
                        handleAuthShow(true);
                        return;
                    }

                    fetchCartCount();
                    navigate("/keranjang");
                }}
                className="relative ml-0.5"
                aria-label="Keranjang"
                title="Keranjang Belanja"
            >
                <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all duration-200 active:scale-95 ${isActive("/keranjang") ? "ring-2 ring-amber-300 ring-offset-1 dark:ring-offset-gray-950" : ""}`}
                >
                    <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                </div>

                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-950">
                        {cartCount > 99 ? "99+" : cartCount}
                    </span>
                )}
            </button>
        </div>
    );
}
