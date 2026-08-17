import { useState, useEffect } from "react";
import { Package, Clock, Truck, CheckCircle, RotateCcw, XCircle } from "lucide-react";

import api from "../api/Axios.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { toMoney } from "../utils/format.js";

export default function usePesanan() {
    const { isAuthenticated } = useAuth();

    const [showAuth, setShowAuth] = useState(false);

    const [externalId, setExternalId] = useState("");
    const [loadingSync, setLoadingSync] = useState(false);

    const [notice, setNotice] = useState("");
    const [noticeType, setNoticeType] = useState("success");

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState("");

    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

    const [showReviewModal, setShowReviewModal] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [reviewChecking, setReviewChecking] = useState(false);

    const [alreadyReviewed, setAlreadyReviewed] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState("");

    const loadOrders = async () => {
        if (!isAuthenticated) {
            setOrders([]);
            setOrdersLoading(false);
            return;
        }

        try {
            setOrdersLoading(true);
            setOrdersError("");

            const res = await api.get("/api/pesanan");

            const arr = Array.isArray(res.data?.data)
                ? res.data.data
                : Array.isArray(res.data)
                  ? res.data
                  : [];

            setOrders(arr);
        } catch (err) {
            console.error("[Orders] Error:", err);
            setOrdersError("Gagal memuat pesanan. Silakan coba lagi.");
        } finally {
            setOrdersLoading(false);
        }
    };

    const sync = async () => {
        if (!externalId.trim()) return;

        try {
            setLoadingSync(true);
            setNotice("");

            await api.get(`/api/payments/sync/${externalId.trim()}`);

            setNotice("Pesanan berhasil disinkronkan.");
            setNoticeType("success");

            await loadOrders();
        } catch (err) {
            console.error("[Payment Sync] Error:", err);

            setNotice("Gagal menyinkronkan pembayaran.");

            setNoticeType("error");
        } finally {
            setLoadingSync(false);

            setTimeout(() => {
                setNotice("");
            }, 4000);
        }
    };

    useEffect(() => {
        loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const getOrderTotal = (order) => {
        if (order?.totalHarga != null) {
            return toMoney(order.totalHarga);
        }

        if (order?.total != null) {
            return toMoney(order.total);
        }

        if (Array.isArray(order?.items)) {
            return order.items.reduce((sum, item) => {
                const qty = parseInt(item.quantity ?? item.jumlah ?? 1, 10) || 1;

                if (item.subtotal != null) {
                    return sum + toMoney(item.subtotal);
                }

                return sum + toMoney(item.hargaSatuan) * qty;
            }, 0);
        }

        return 0;
    };

    const getStatusConfig = (status) => {
        const s = (status || "").toUpperCase();

        if (["PENDING", "UNPAID", "DIBUAT", "CREATED"].includes(s)) {
            return {
                label: "Menunggu Pembayaran",
                color: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
                icon: Clock,
            };
        }

        if (["PAID", "SETTLED", "PROCESSING", "DIKEMAS", "DIPROSES", "PACKED"].includes(s)) {
            return {
                label: "Diproses",
                color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
                icon: Package,
            };
        }

        if (["SHIPPED", "DIKIRIM"].includes(s)) {
            return {
                label: "Dikirim",
                color: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
                icon: Truck,
            };
        }

        if (["COMPLETED", "DELIVERED", "SELESAI"].includes(s)) {
            return {
                label: "Selesai",
                color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
                icon: CheckCircle,
            };
        }

        if (["DIBATALKAN", "CANCELLED"].includes(s)) {
            return {
                label: "Dibatalkan",
                color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
                icon: XCircle,
            };
        }

        if (["DIKEMBALIKAN", "PENGEMBALIAN", "RETURNED", "REFUNDED"].includes(s)) {
            return {
                label: "Dikembalikan",
                color: "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
                icon: RotateCcw,
            };
        }

        return {
            label: status || "Status tidak diketahui",
            color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
            icon: Clock,
        };
    };

    const filteredOrders = orders
        .filter((order) => {
            const status = (order.status || "").toUpperCase();

            if (activeTab === "all") {
                return true;
            }

            if (activeTab === "pending") {
                return ["PENDING", "UNPAID", "DIBUAT", "CREATED"].includes(status);
            }

            if (activeTab === "processing") {
                return ["PAID", "SETTLED", "PROCESSING", "DIKEMAS", "DIPROSES", "PACKED"].includes(
                    status,
                );
            }

            if (activeTab === "shipped") {
                return ["SHIPPED", "DIKIRIM"].includes(status);
            }

            if (activeTab === "completed") {
                return ["COMPLETED", "DELIVERED", "SELESAI"].includes(status);
            }

            if (activeTab === "cancelled") {
                return ["CANCELLED", "DIBATALKAN"].includes(status);
            }

            if (activeTab === "returned") {
                return ["DIKEMBALIKAN", "PENGEMBALIAN", "RETURNED", "REFUNDED"].includes(status);
            }

            return true;
        })
        .filter((order) => {
            const query = searchTerm.trim().toLowerCase();

            if (!query) return true;

            return (
                String(order.id ?? order.orderId ?? "")
                    .toLowerCase()
                    .includes(query) ||
                String(order.externalId ?? "")
                    .toLowerCase()
                    .includes(query)
            );
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);

            const dateB = new Date(b.createdAt || 0);

            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });

    const openReviewModal = async (order, product) => {
        setSelectedOrder(order);
        setSelectedProduct(product);
        setReviewRating(0);
        setReviewComment("");
        setReviewError("");
        setAlreadyReviewed(false);
        setShowReviewModal(true);

        const produkId = product?.produkId;
        const pesananId = order?.id || order?.orderId;

        if (!produkId || !pesananId) return;

        try {
            setReviewChecking(true);

            const res = await api.get(`/api/reviews/check/${produkId}/${pesananId}`);

            setAlreadyReviewed(Boolean(res.data?.hasReviewed));
        } catch (err) {
            console.warn("[Review] Gagal memeriksa ulasan sebelumnya:", err.message);
        } finally {
            setReviewChecking(false);
        }
    };

    const closeReviewModal = () => {
        setAlreadyReviewed(false);
        setReviewChecking(false);
        setShowReviewModal(false);
        setSelectedOrder(null);
        setSelectedProduct(null);
        setReviewRating(0);
        setReviewComment("");
        setReviewError("");
    };

    const submitReview = async () => {
        if (reviewRating === 0) {
            setReviewError("Pilih rating terlebih dahulu.");
            return;
        }

        if (!reviewComment.trim()) {
            setReviewError("Tulis komentar Anda.");
            return;
        }

        if (!isAuthenticated) {
            setReviewError("Silakan login terlebih dahulu.");
            return;
        }

        try {
            setReviewLoading(true);
            setReviewError("");

            const payload = {
                produkId: selectedProduct.produkId,
                pesananId: selectedOrder.id || selectedOrder.orderId,
                rating: reviewRating,
                komentar: reviewComment.trim(),
            };

            await api.post("/api/reviews", payload);

            setNotice("Review berhasil dikirim.");

            setNoticeType("success");

            closeReviewModal();

            loadOrders();

            setTimeout(() => {
                setNotice("");
            }, 4000);
        } catch (err) {
            console.error("[Review] Error:", err);

            setReviewError(err.response?.data?.message || "Gagal mengirim review.");
        } finally {
            setReviewLoading(false);
        }
    };

    const totalFilteredValue = filteredOrders.reduce((sum, order) => sum + getOrderTotal(order), 0);

    return {
        showAuth,
        setShowAuth,
        externalId,
        setExternalId,
        loadingSync,
        notice,
        noticeType,
        orders,
        ordersLoading,
        ordersError,
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        sortOrder,
        setSortOrder,
        showReviewModal,
        selectedOrder,
        reviewChecking,
        alreadyReviewed,
        selectedProduct,
        reviewRating,
        setReviewRating,
        reviewComment,
        setReviewComment,
        reviewError,
        reviewLoading,
        filteredOrders,
        totalFilteredValue,
        loadOrders,
        sync,
        getStatusConfig,
        getOrderTotal,
        openReviewModal,
        closeReviewModal,
        submitReview,
    };
}
