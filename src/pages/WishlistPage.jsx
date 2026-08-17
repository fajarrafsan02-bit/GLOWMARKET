import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import useWishlist from "../hooks/useWishlist.js";

import WishlistNotice from "../components/wishlist/WishlistNotice.jsx";
import WishlistErrorBanner from "../components/wishlist/WishlistErrorBanner.jsx";
import WishlistSkeleton from "../components/wishlist/WishlistSkeleton.jsx";
import WishlistEmptyState from "../components/wishlist/WishlistEmptyState.jsx";
import WishlistToolbar from "../components/wishlist/WishlistToolbar.jsx";
import WishlistCard from "../components/wishlist/WishlistCard.jsx";

export default function Wishlist() {
    const {
        loading,
        error,
        notice,
        noticeType,
        validItems,
        loadWishlist,
        removeFromWishlist,
        addToCart,
        addAllToCart,
        formatPrice,
    } = useWishlist();

    return (
        <div className="min-h-screen bg-[#f7f7f7] dark:bg-gray-950">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                {/* PAGE HEADER */}
                <div className="mb-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                Wishlist
                            </h1>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Simpan produk yang ingin Anda beli nanti.
                            </p>
                        </div>

                        <Link
                            to="/katalog"
                            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition"
                        >
                            Lanjut Belanja
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <Link
                        to="/katalog"
                        className="sm:hidden inline-flex mt-3 text-xs font-medium text-amber-600 dark:text-amber-400"
                    >
                        ← Lanjut Belanja
                    </Link>
                </div>

                {/* NOTICE */}
                <WishlistNotice notice={notice} noticeType={noticeType} />

                {/* ERROR */}
                {error && <WishlistErrorBanner error={error} onRetry={loadWishlist} />}

                {/* LOADING */}
                {loading && <WishlistSkeleton />}

                {/* EMPTY */}
                {!loading && validItems.length === 0 && <WishlistEmptyState />}

                {/* CONTENT */}
                {!loading && validItems.length > 0 && (
                    <>
                        <WishlistToolbar count={validItems.length} onAddAll={addAllToCart} />

                        <Motion.div
                            layout
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4"
                        >
                            <AnimatePresence>
                                {validItems.map((item) => (
                                    <WishlistCard
                                        key={item.id}
                                        item={item}
                                        onRemove={removeFromWishlist}
                                        onAddToCart={addToCart}
                                        formatPrice={formatPrice}
                                    />
                                ))}
                            </AnimatePresence>
                        </Motion.div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
