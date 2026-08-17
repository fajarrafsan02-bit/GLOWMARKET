import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { PRODUCT_CATEGORIES as categories } from "../utils/productCategory.js";
import { toMoney } from "../utils/format.js";

export default function useKatalog() {
    const { isAuthenticated, loading: authLoading } = useAuth();

    const isLoggedIn = isAuthenticated;

    const [searchParams] = useSearchParams();

    const [items, setItems] = useState([]);

    const [loading, setLoading] = useState(false);

    const [query, setQuery] = useState("");

    const [notice, setNotice] = useState("");

    const [selected, setSelected] = useState(null);

    const [showAuth, setShowAuth] = useState(false);

    const [wishlistIds, setWishlistIds] = useState([]);

    // Kategori bisa datang dari tautan seperti /katalog?kategori=Cincin
    const [selectedCategory, setSelectedCategory] = useState(() => {
        const fromUrl = searchParams.get("kategori");

        if (!fromUrl) return "Semua";

        const match = categories.find(
            (category) => category.toLowerCase() === fromUrl.trim().toLowerCase(),
        );

        return match || "Semua";
    });

    const [selectedKarat, setSelectedKarat] = useState("Semua");

    const [sortBy, setSortBy] = useState("terbaru");

    const [showFilters, setShowFilters] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 12;

    const [productReviews, setProductReviews] = useState({});

    useEffect(() => {
        // Menunggu AuthProvider selesai memastikan status login dulu — kalau
        // tidak, wishlist bisa terlewat dimuat gara-gara pemeriksaannya berjalan
        // sebelum status login (yang sekarang baru diketahui lewat cookie/server,
        // bukan langsung dari localStorage) sempat terjawab.
        if (authLoading) return;

        const load = async () => {
            try {
                setLoading(true);

                const res = await api.get("/api/produk");

                const arr = Array.isArray(res.data?.data) ? res.data.data : [];

                setItems(arr);

                arr.forEach(async (product) => {
                    try {
                        const reviewRes = await api.get(`/api/reviews/produk/${product.id}`);

                        const reviews = reviewRes.data?.data || [];

                        setProductReviews((prev) => ({ ...prev, [product.id]: reviews }));
                    } catch (err) {
                        console.error("[Katalog] Error fetching reviews:", err);
                    }
                });

                if (isAuthenticated) {
                    try {
                        const wRes = await api.get("/api/wishlist");

                        const wArr = Array.isArray(wRes.data?.data) ? wRes.data.data : [];

                        setWishlistIds(wArr.map((w) => w.produkId).filter(Boolean));
                    } catch (error) {
                        console.debug("Gagal memuat wishlist", error);
                    }
                }
            } catch (error) {
                console.error("Gagal memuat katalog", error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [authLoading, isAuthenticated]);

    const fetchProductReviews = async (produkId) => {
        if (productReviews[produkId]) return;

        try {
            const res = await api.get(`/api/reviews/produk/${produkId}`);

            const reviews = res.data?.data || [];

            setProductReviews((prev) => ({ ...prev, [produkId]: reviews }));
        } catch (err) {
            console.error("[Katalog] Error fetching reviews:", err);
        }
    };

    const getAverageRating = (produkId) => {
        const reviews = productReviews[produkId] || [];

        if (reviews.length === 0) return 0;

        const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);

        return (sum / reviews.length).toFixed(1);
    };

    const getReviewCount = (produkId) => (productReviews[produkId] || []).length;

    const filteredSortedItems = useMemo(() => {
        let arr = [...items];

        const q = query.trim().toLowerCase();

        if (q) arr = arr.filter((p) => p.nama?.toLowerCase().includes(q));

        if (selectedCategory !== "Semua") {
            const key = selectedCategory.toLowerCase();

            // Utamakan field kategori; produk lama yang kategorinya masih kosong
            // tetap tersaring lewat pencocokan nama seperti sebelumnya.
            arr = arr.filter((p) =>
                p.kategori ? p.kategori.toLowerCase() === key : p.nama?.toLowerCase().includes(key),
            );
        }

        if (selectedKarat !== "Semua") {
            const karatValue = parseInt(selectedKarat.replace("K", ""));

            arr = arr.filter((p) => p.karatEmas === karatValue);
        }

        if (sortBy === "harga_asc") arr.sort((a, b) => toMoney(a.harga) - toMoney(b.harga));
        else if (sortBy === "harga_desc")
            arr.sort((a, b) => toMoney(b.harga) - toMoney(a.harga));
        else if (sortBy === "karat_asc")
            arr.sort((a, b) => (a.karatEmas || 0) - (b.karatEmas || 0));
        else if (sortBy === "karat_desc")
            arr.sort((a, b) => (b.karatEmas || 0) - (a.karatEmas || 0));

        return arr;
    }, [items, query, selectedCategory, selectedKarat, sortBy]);

    const totalPages = Math.ceil(filteredSortedItems.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;

    const currentItems = filteredSortedItems.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [query, selectedCategory, selectedKarat, sortBy]);

    const showNotice = (msg) => {
        setNotice(msg);

        setTimeout(() => setNotice(""), 3000);
    };

    const addToCart = async (p, variantId = null) => {
        if (!isLoggedIn) {
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
        if (!isLoggedIn) {
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

    const handleDetail = (p) => {
        setSelected(p);

        fetchProductReviews(p.id);
    };

    const daftarRestock = async (p, variantId = null) => {
        if (!isLoggedIn) {
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

    const resetFilters = () => {
        setQuery("");
        setSelectedCategory("Semua");
        setSelectedKarat("Semua");
        setSortBy("terbaru");
    };

    return {
        isLoggedIn,
        loading,
        items,
        query,
        setQuery,
        notice,
        selected,
        setSelected,
        showAuth,
        setShowAuth,
        wishlistIds,
        selectedCategory,
        setSelectedCategory,
        selectedKarat,
        setSelectedKarat,
        sortBy,
        setSortBy,
        showFilters,
        setShowFilters,
        currentPage,
        setCurrentPage,
        filteredSortedItems,
        currentItems,
        totalPages,
        productReviews,
        getAverageRating,
        getReviewCount,
        addToCart,
        toggleWishlist,
        handleDetail,
        daftarRestock,
        resetFilters,
    };
}
