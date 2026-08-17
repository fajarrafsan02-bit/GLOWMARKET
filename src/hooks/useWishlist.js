import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function useWishlist() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [notice, setNotice] = useState("");
    const [noticeType, setNoticeType] = useState("success");

    /* ============================================================
       LOAD WISHLIST
    ============================================================ */

    const loadWishlist = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/wishlist");

            const data = Array.isArray(response.data?.data) ? response.data.data : [];

            setItems(data);
        } catch (err) {
            console.error("[Wishlist] Load error:", err);

            setError("Gagal memuat wishlist. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", {
                replace: true,
            });
            return;
        }

        loadWishlist();
    }, [navigate, isAuthenticated, loadWishlist]);

    /* ============================================================
       NOTICE
    ============================================================ */

    const showNotice = (message, type = "success", duration = 3000) => {
        setNotice(message);
        setNoticeType(type);

        setTimeout(() => {
            setNotice("");
        }, duration);
    };

    /* ============================================================
       REMOVE
    ============================================================ */

    const removeFromWishlist = async (wishlistId) => {
        try {
            await api.delete(`/api/wishlist/${wishlistId}`);

            setItems((current) => current.filter((item) => item.id !== wishlistId));

            window.dispatchEvent(new Event("wishlist:update"));

            showNotice("Produk dihapus dari wishlist.");
        } catch (err) {
            console.error("[Wishlist] Remove error:", err);

            showNotice("Gagal menghapus produk.", "error", 4000);
        }
    };

    /* ============================================================
       ADD TO CART
    ============================================================ */

    const addToCart = async (product, variantId = null) => {
        try {
            await api.post("/api/keranjang", {
                produkId: product.id,
                variantId,
                quantity: 1,
            });

            window.dispatchEvent(new Event("cart:update"));

            showNotice(`${product.nama} ditambahkan ke keranjang.`);
        } catch (err) {
            console.error("[Wishlist] Add cart error:", err);

            showNotice("Gagal menambahkan ke keranjang.", "error", 4000);
        }
    };

    /* ============================================================
       ADD ALL TO CART
    ============================================================ */

    const addAllToCart = async () => {
        if (items.length === 0) return;

        try {
            for (const item of items) {
                if (!item.produk) continue;

                await api.post("/api/keranjang", {
                    produkId: item.produk.id,
                    quantity: 1,
                });
            }

            window.dispatchEvent(new Event("cart:update"));

            showNotice("Semua produk berhasil ditambahkan ke keranjang.", "success", 4000);
        } catch (err) {
            console.error("[Wishlist] Add all error:", err);

            showNotice("Sebagian produk mungkin gagal ditambahkan.", "error", 4000);
        }
    };

    /* ============================================================
       PRICE
    ============================================================ */

    const formatPrice = (value) => {
        if (typeof value !== "number" && typeof value !== "string") {
            return "Rp -";
        }

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(Number(value) || 0);
    };

    const validItems = useMemo(() => items.filter((item) => item.produk), [items]);

    return {
        items,
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
    };
}
