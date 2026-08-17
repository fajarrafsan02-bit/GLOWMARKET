/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShoppingBag } from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";

import HomeHero from "../components/home/HomeHero.jsx";
import HomeCategories from "../components/home/HomeCategories.jsx";
import HomeFeatures from "../components/home/HomeFeatures.jsx";
import HomeProductCard from "../components/home/HomeProductCard.jsx";
import HomeProductModal from "../components/home/HomeProductModal.jsx";
import HomeToast from "../components/home/HomeToast.jsx";

import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatPrice } from "../utils/format.js";

export default function UserHomePage() {
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAuth, setShowAuth] = useState(false);
    const [notice, setNotice] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [productReviews, setProductReviews] = useState({});

    const notify = (msg) => {
        setNotice(msg);
        setTimeout(() => setNotice(""), 3000);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await api.get("/api/produk");
                const list = Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data)
                      ? res.data
                      : [];
                setProducts(list);

                list.forEach(async (p) => {
                    try {
                        const revRes = await api.get(`/api/reviews/produk/${p.id}`);
                        const reviews = revRes.data?.data || [];
                        setProductReviews((prev) => ({ ...prev, [p.id]: reviews }));
                    } catch {
                        // ignore review fetch errors
                    }
                });
            } catch (err) {
                console.error("Error fetching products for Home:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (authLoading || !isAuthenticated) return;

        const fetchWishlist = async () => {
            try {
                const res = await api.get("/api/wishlist");
                const list = Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data)
                      ? res.data
                      : [];
                const ids = list.map((item) => item.produk?.id || item.produkId).filter(Boolean);
                setWishlistIds(ids);
            } catch {
                // ignore wishlist fetch errors
            }
        };

        fetchWishlist();
    }, [authLoading, isAuthenticated]);

    const getAverageRating = (productId) => {
        const reviews = productReviews[productId] || [];
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
        return (sum / reviews.length).toFixed(1);
    };

    const getReviewCount = (productId) => {
        const reviews = productReviews[productId] || [];
        return reviews.length;
    };

    const toggleWishlist = async (product, e) => {
        if (e && typeof e.stopPropagation === "function") {
            e.stopPropagation();
        } else if (product && typeof product.stopPropagation === "function") {
            product.stopPropagation();
        }

        const targetProduct = product && product.id ? product : e && e.id ? e : null;
        if (!targetProduct) return;

        if (!isAuthenticated) {
            setShowAuth(true);
            return;
        }

        const isWish = wishlistIds.includes(targetProduct.id);
        try {
            if (isWish) {
                await api.delete(`/api/wishlist/${targetProduct.id}`);
                setWishlistIds((prev) => prev.filter((id) => id !== targetProduct.id));
                notify("Dihapus dari wishlist");
            } else {
                await api.post("/api/wishlist", { produkId: targetProduct.id });
                setWishlistIds((prev) => [...prev, targetProduct.id]);
                notify("Ditambahkan ke wishlist");
            }
        } catch {
            notify("Gagal memperbarui wishlist");
        }
    };

    const addToCart = async (product, variantId = null) => {
        const targetProduct = product && product.id ? product : null;
        if (!targetProduct) return;

        if (!isAuthenticated) {
            setShowAuth(true);
            return;
        }

        try {
            await api.post("/api/keranjang", {
                produkId: targetProduct.id,
                variantId,
                quantity: 1,
            });
            window.dispatchEvent(new Event("cart:updated"));
            notify("Produk berhasil ditambahkan ke keranjang");
        } catch {
            notify("Gagal menambahkan ke keranjang");
        }
    };

    const daftarRestock = async (product, variantId = null) => {
        const targetProduct = product && product.id ? product : null;
        if (!targetProduct) return;

        if (!isAuthenticated) {
            setShowAuth(true);
            return;
        }

        try {
            await api.post("/api/restock/notifikasi", {
                produkId: targetProduct.id,
                variantId,
            });
            notify("Kami akan memberi tahu saat stok tersedia!");
        } catch {
            notify("Gagal mendaftar notifikasi restock");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
            <Header setShowAuth={setShowAuth} />

            <main className="flex-1">
                {/* HERO SECTION */}
                <HomeHero />

                {/* CATEGORIES SECTION */}
                <HomeCategories />

                {/* PRODUCTS SECTION */}
                <section id="products" className="py-16 sm:py-24 bg-gray-50/50 dark:bg-gray-900/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 mb-3">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Pilihan Populer
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    Koleksi Perhiasan Emas
                                </h2>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Temukan perhiasan emas berkualitas dengan desain eksklusif
                                </p>
                            </div>

                            <Link
                                to="/katalog"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 transition"
                            >
                                Lihat Semua Katalog
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-72 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-16">
                                <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    Belum ada produk yang ditampilkan.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                {products.slice(0, 8).map((p) => (
                                    <HomeProductCard
                                        key={p.id}
                                        p={p}
                                        isWishlisted={wishlistIds.includes(p.id)}
                                        avgRating={getAverageRating(p.id)}
                                        reviewCount={getReviewCount(p.id)}
                                        onToggleWishlist={(e) => toggleWishlist(p, e)}
                                        onAddToCart={() => addToCart(p)}
                                        onSelect={() => setSelectedProduct(p)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* FEATURES SECTION */}
                <HomeFeatures />
            </main>

            <Footer />

            {/* MODALS & TOAST */}
            <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />

            <HomeProductModal
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                wishlistIds={wishlistIds}
                toggleWishlist={toggleWishlist}
                addToCart={addToCart}
                onRestockNotif={daftarRestock}
                getAverageRating={getAverageRating}
                getReviewCount={getReviewCount}
                productReviews={productReviews}
                formatPrice={formatPrice}
                navigate={navigate}
            />

            <HomeToast notice={notice} />
        </div>
    );
}
