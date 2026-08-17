import { useState, useEffect } from "react";
import { User, MapPin, Heart, CreditCard, Settings, Star, Coins, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useAddressForm from "./useAddressForm.js";

export default function useUserProfile() {
    const navigate = useNavigate();

    const { user, isAuthenticated, logout, refresh } = useAuth();

    const [showAuth, setShowAuth] = useState(false);

    const [userName, setUserName] = useState(user?.namaLengkap || "Member GlowMarket");
    const [userEmail, setUserEmail] = useState(user?.email || "email@contoh.com");
    const [userPhone, setUserPhone] = useState(user?.noHp || "");

    /* Disimpan terpisah agar panel verifikasi bisa langsung menghilang begitu
       kode diterima, tanpa menunggu profil dimuat ulang dari server. */
    const [emailTerverifikasi, setEmailTerverifikasi] = useState(
        Boolean(user?.emailTerverifikasi),
    );

    const [activeTab, setActiveTab] = useState("profile");

    const [notice, setNotice] = useState("");
    const [noticeType, setNoticeType] = useState("success");

    const [editingProfile, setEditingProfile] = useState(false);

    const [editName, setEditName] = useState(user?.namaLengkap || "");
    const [editEmail, setEditEmail] = useState(user?.email || "");
    const [editPhone, setEditPhone] = useState(user?.noHp || "");

    const [confirmLogout, setConfirmLogout] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const [payments, setPayments] = useState([]);
    const [paymentsLoading, setPaymentsLoading] = useState(false);
    const [paymentsError, setPaymentsError] = useState("");

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewsError, setReviewsError] = useState("");

    const notify = (message, type = "success", timeout = 3000) => {
        setNotice(message);
        setNoticeType(type);

        if (timeout > 0) {
            setTimeout(() => {
                setNotice("");
            }, timeout);
        }
    };

    /* Dipanggil panel verifikasi setelah kode diterima server. AuthContext
       ikut dimuat ulang supaya halaman lain — terutama checkout — melihat
       status barunya tanpa perlu login ulang. */
    const tandaiEmailTerverifikasi = () => {
        setEmailTerverifikasi(true);
        notify("Email berhasil diverifikasi.", "success");
        refresh();
    };

    const addressForm = useAddressForm({
        userName,
        notify,
        setShowAuth,
    });

    const loadWishlist = async () => {
        if (!isAuthenticated) {
            return;
        }

        try {
            setWishlistLoading(true);

            const response = await api.get("/api/wishlist");

            const data = Array.isArray(response.data?.data) ? response.data.data : [];

            setWishlistItems(data);
        } catch (error) {
            console.error("Gagal memuat wishlist:", error);
        } finally {
            setWishlistLoading(false);
        }
    };

    const removeFromWishlist = async (wishlistId) => {
        try {
            await api.delete(`/api/wishlist/${wishlistId}`);

            notify("Item dihapus dari wishlist");

            window.dispatchEvent(new Event("wishlist:update"));

            loadWishlist();
        } catch {
            notify("Gagal menghapus item", "error", 4000);
        }
    };

    const addToCart = async (product, variantId = null) => {
        try {
            await api.post("/api/keranjang", {
                produkId: product.id,
                variantId,
                quantity: 1,
            });

            notify(`${product.nama} ditambahkan ke keranjang`);

            window.dispatchEvent(new Event("cart:update"));
        } catch {
            notify("Gagal menambahkan ke keranjang", "error", 4000);
        }
    };

    useEffect(() => {
        if (activeTab === "wishlist") {
            loadWishlist();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    /* Profil kerap selesai dimuat setelah komponen ini dipasang, jadi status
       verifikasi diikutkan agar panelnya tidak salah tampil sesaat. */
    useEffect(() => {
        setEmailTerverifikasi(Boolean(user?.emailTerverifikasi));
    }, [user?.emailTerverifikasi]);

    useEffect(() => {
        if (activeTab !== "reviews" || !isAuthenticated) {
            return;
        }

        let batal = false;

        const muat = async () => {
            try {
                setReviewsLoading(true);
                setReviewsError("");

                const res = await api.get("/api/reviews/user");

                if (batal) return;

                setReviews(Array.isArray(res.data?.data) ? res.data.data : []);
            } catch (err) {
                if (batal) return;

                setReviews([]);
                setReviewsError(err.response?.data?.message || "Gagal memuat ulasan");
            } finally {
                if (!batal) {
                    setReviewsLoading(false);
                }
            }
        };

        muat();

        return () => {
            batal = true;
        };
    }, [activeTab, isAuthenticated]);

    useEffect(() => {
        if (activeTab !== "payments" || !isAuthenticated) {
            return;
        }

        const loadPayments = async () => {
            try {
                setPaymentsLoading(true);
                setPaymentsError("");

                const response = await api.get("/api/payments/user/history");

                const data = Array.isArray(response.data?.data)
                    ? response.data.data
                    : Array.isArray(response.data)
                      ? response.data
                      : [];

                setPayments(data);
            } catch (error) {
                setPaymentsError(error.message || "Gagal memuat riwayat pembayaran");
            } finally {
                setPaymentsLoading(false);
            }
        };

        loadPayments();
    }, [activeTab, isAuthenticated]);

    const saveProfile = async () => {
        if (!isAuthenticated) {
            setShowAuth(true);
            return;
        }

        try {
            const payload = {
                namaLengkap: editName.trim(),
                noHp: editPhone.trim(),
            };

            let success = false;

            const endpoints = ["/api/user/profile", "/user/profile", "/api/user", "/user"];

            for (const endpoint of endpoints) {
                if (success) break;

                try {
                    await api.put(endpoint, payload);

                    success = true;
                } catch (error) {
                    console.error(`Error saving profile to ${endpoint}:`, error);
                }
            }

            if (!success) {
                throw new Error("Endpoint profil tidak tersedia");
            }

            setUserName(editName);
            setUserEmail(editEmail);
            setUserPhone(editPhone);

            // Sinkronkan juga AuthContext supaya komponen lain yang membaca
            // nama/email dari sana (mis. Header) ikut menampilkan versi baru.
            await refresh();

            setEditingProfile(false);

            notify("Profil berhasil diperbarui");
        } catch (error) {
            notify(
                error.response?.data?.message || error.message || "Gagal memperbarui profil",
                "error",
            );
        }
    };

    const syncPayment = async (payment) => {
        try {
            let response;

            if (payment.externalId) {
                response = await api.post(`/api/payments/sync/${payment.externalId}`);
            } else if (payment.invoiceId) {
                response = await api.post(`/api/payments/sync-by-xendit/${payment.invoiceId}`);
            }

            if (response?.data?.success) {
                notify("Status pembayaran diperbarui");

                try {
                    const history = await api.get("/api/payments/user/history");

                    const data = Array.isArray(history.data?.data) ? history.data.data : [];

                    setPayments(data);
                } catch (error) {
                    console.error("Failed refreshing payment history:", error);
                }
            } else {
                notify(response?.data?.message || "Gagal sinkron status", "error");
            }
        } catch (error) {
            console.error("[UserProfile] Sync error:", error);

            notify(error.response?.data?.message || "Gagal sinkron status", "error");
        }
    };

    const handleLogout = async () => {
        setLoggingOut(true);

        await logout();

        setShowAuth(false);

        notify("Berhasil keluar");

        setTimeout(() => {
            setLoggingOut(false);
            navigate("/");
        }, 1200);
    };

    const tabs = [
        {
            id: "profile",
            label: "Profil",
            description: "Data pribadi dan kontak",
            icon: User,
        },
        {
            id: "poin",
            label: "Poin Saya",
            description: "Tukar poin & voucher diskon",
            icon: Coins,
            isLink: true,
            href: "/poin",
        },
        {
            id: "pengembalian",
            label: "Pengembalian Saya",
            description: "Ajukan & cek status retur",
            icon: RotateCcw,
            isLink: true,
            href: "/pengembalian",
        },
        {
            id: "address",
            label: "Alamat",
            description: "Alamat pengiriman",
            icon: MapPin,
        },
        {
            id: "wishlist",
            label: "Wishlist",
            description: "Produk favorit",
            icon: Heart,
        },
        {
            id: "payments",
            label: "Pembayaran",
            description: "Riwayat transaksi",
            icon: CreditCard,
        },
        {
            id: "reviews",
            label: "Ulasan Saya",
            description: "Penilaian yang pernah ditulis",
            icon: Star,
        },
        {
            id: "settings",
            label: "Pengaturan",
            description: "Preferensi akun",
            icon: Settings,
        },
    ];

    const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0];

    return {
        showAuth,
        setShowAuth,
        userName,
        userEmail,
        userPhone,
        activeTab,
        setActiveTab,
        notice,
        noticeType,
        editingProfile,
        setEditingProfile,
        editName,
        setEditName,
        editEmail,
        setEditEmail,
        editPhone,
        setEditPhone,
        confirmLogout,
        setConfirmLogout,
        loggingOut,
        wishlistItems,
        wishlistLoading,
        payments,
        paymentsLoading,
        paymentsError,
        reviews,
        reviewsLoading,
        reviewsError,
        notify,
        addressForm,
        removeFromWishlist,
        addToCart,
        emailTerverifikasi,
        tandaiEmailTerverifikasi,
        saveProfile,
        syncPayment,
        handleLogout,
        tabs,
        activeTabData,
    };
}
