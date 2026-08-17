import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const RELATED_LIMIT = 8;

export default function useProductDetailPage(productId) {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    const [allProducts, setAllProducts] = useState([]);

    /** Ulasan produk terkait, dipakai hanya untuk menampilkan rating di kartunya. */
    const [relatedReviews, setRelatedReviews] = useState({});

    const [wishlistIds, setWishlistIds] = useState([]);

    const [notice, setNotice] = useState("");
    const [showAuth, setShowAuth] = useState(false);

    const showNotice = (msg) => {
        setNotice(msg);
        setTimeout(() => setNotice(""), 3000);
    };

    const loadProduct = useCallback(async () => {
        setLoading(true);
        setNotFound(false);
        try {
            const res = await api.get(`/api/produk/${productId}`);
            setProduct(res.data?.data || null);
        } catch (err) {
            if (err.response?.status === 404) {
                setNotFound(true);
            } else {
                showNotice("Gagal memuat produk");
            }
            setProduct(null);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        loadProduct();
        window.scrollTo({ top: 0 });
    }, [loadProduct]);

    useEffect(() => {
        if (!productId) return;

        const loadReviews = async () => {
            try {
                setReviewsLoading(true);
                const res = await api.get(`/api/reviews/produk/${productId}`);
                setReviews(Array.isArray(res.data?.data) ? res.data.data : []);
            } catch {
                setReviews([]);
            } finally {
                setReviewsLoading(false);
            }
        };

        loadReviews();
    }, [productId]);

    useEffect(() => {
        const loadAllProducts = async () => {
            try {
                const res = await api.get("/api/produk");
                setAllProducts(Array.isArray(res.data?.data) ? res.data.data : []);
            } catch {
                setAllProducts([]);
            }
        };

        loadAllProducts();
    }, []);

    useEffect(() => {
        if (authLoading || !isAuthenticated) {
            setWishlistIds([]);
            return;
        }

        const loadWishlist = async () => {
            try {
                const res = await api.get("/api/wishlist");
                const arr = Array.isArray(res.data?.data) ? res.data.data : [];
                setWishlistIds(arr.map((w) => w.produkId).filter(Boolean));
            } catch {
                setWishlistIds([]);
            }
        };

        loadWishlist();
    }, [authLoading, isAuthenticated]);

    const relatedProducts = useMemo(() => {
        if (!product) return [];

        const sameCategory = allProducts.filter(
            (p) => p.id !== product.id && p.kategori && p.kategori === product.kategori,
        );

        if (sameCategory.length >= RELATED_LIMIT) {
            return sameCategory.slice(0, RELATED_LIMIT);
        }

        const fillers = allProducts.filter(
            (p) =>
                p.id !== product.id &&
                !sameCategory.some((sp) => sp.id === p.id) &&
                (p.karatEmas === product.karatEmas || !product.karatEmas),
        );

        return [...sameCategory, ...fillers].slice(0, RELATED_LIMIT);
    }, [allProducts, product]);

    /*
     * Rating produk terkait diambil setelah daftarnya ditentukan — hanya
     * sejumlah kartu yang benar-benar tampil, bukan seluruh katalog.
     */
    useEffect(() => {
        if (relatedProducts.length === 0) return;

        let dibatalkan = false;

        const muatUlasanTerkait = async () => {
            const hasil = await Promise.all(
                relatedProducts.map(async (p) => {
                    try {
                        const res = await api.get(`/api/reviews/produk/${p.id}`);
                        return [p.id, Array.isArray(res.data?.data) ? res.data.data : []];
                    } catch {
                        return [p.id, []];
                    }
                }),
            );

            if (!dibatalkan) {
                setRelatedReviews(Object.fromEntries(hasil));
            }
        };

        muatUlasanTerkait();

        return () => {
            dibatalkan = true;
        };
    }, [relatedProducts]);

    const avgRating = useMemo(() => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
        return Number((sum / reviews.length).toFixed(1));
    }, [reviews]);

    const reviewCount = reviews.length;

    const isWishlisted = product ? wishlistIds.includes(product.id) : false;

    const getRelatedRating = (produkId) => {
        const list = relatedReviews[produkId] || [];
        if (list.length === 0) return 0;
        const sum = list.reduce((acc, r) => acc + (r.rating || 0), 0);
        return (sum / list.length).toFixed(1);
    };

    const getRelatedReviewCount = (produkId) => (relatedReviews[produkId] || []).length;

    const addToCart = async (p, variantId = null) => {
        if (!isAuthenticated) {
            showNotice("Silakan login terlebih dahulu");
            setShowAuth(true);
            return;
        }

        try {
            await api.post("/api/keranjang", { produkId: p.id, variantId, quantity: 1 });
            showNotice("Ditambahkan ke keranjang!");
            window.dispatchEvent(new Event("cart:update"));
        } catch (err) {
            showNotice(err.response?.data?.message || "Gagal tambah ke keranjang");
        }
    };

    const toggleWishlist = async (produkId) => {
        if (!isAuthenticated) {
            showNotice("Silakan login terlebih dahulu");
            setShowAuth(true);
            return;
        }

        const isIn = wishlistIds.includes(produkId);

        try {
            if (isIn) {
                const wRes = await api.get("/api/wishlist");
                const item = (wRes.data?.data || []).find((w) => w.produkId === produkId);
                if (item) await api.delete(`/api/wishlist/${item.id}`);
                setWishlistIds((prev) => prev.filter((id) => id !== produkId));
                showNotice("Dihapus dari wishlist");
            } else {
                await api.post("/api/wishlist", { produkId });
                setWishlistIds((prev) => [...prev, produkId]);
                showNotice("Ditambahkan ke wishlist");
            }
            window.dispatchEvent(new Event("wishlist:update"));
        } catch {
            showNotice("Gagal update wishlist");
        }
    };

    const daftarRestock = async (p, variantId = null) => {
        if (!isAuthenticated) {
            showNotice("Silakan login terlebih dahulu");
            setShowAuth(true);
            return;
        }

        try {
            await api.post("/api/restock/notifikasi", { produkId: p.id, variantId });
            showNotice("Kami akan memberi tahu saat stok tersedia!");
        } catch (err) {
            showNotice(err.response?.data?.message || "Gagal mendaftar notifikasi");
        }
    };

    const goToProduct = (id) => {
        navigate(`/produk/${id}`);
    };

    return {
        product,
        loading,
        notFound,
        reviews,
        reviewsLoading,
        avgRating,
        reviewCount,
        relatedProducts,
        getRelatedRating,
        getRelatedReviewCount,
        wishlistIds,
        isWishlisted,
        notice,
        showAuth,
        setShowAuth,
        addToCart,
        toggleWishlist,
        daftarRestock,
        goToProduct,
    };
}
