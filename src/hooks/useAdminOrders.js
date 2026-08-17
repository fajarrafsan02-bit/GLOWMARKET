import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/Axios.jsx";

function getStatusKey(status) {
    const value = String(status || "").toUpperCase();

    if (["PENDING", "UNPAID", "DIBUAT", "CREATED"].includes(value)) {
        return "pending";
    }

    if (["PAID", "SETTLED", "PROCESSING", "DIKEMAS", "DIPROSES", "PACKED"].includes(value)) {
        return "processing";
    }

    if (["SHIPPED", "DIKIRIM"].includes(value)) {
        return "shipped";
    }

    if (["COMPLETED", "DELIVERED", "SELESAI"].includes(value)) {
        return "completed";
    }

    return "other";
}

export default function useAdminOrders() {
    const [query, setQuery] = useState("");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [tempStatus, setTempStatus] = useState("");

    const [tempResi, setTempResi] = useState("");

    const [trackingLoading, setTrackingLoading] = useState(false);

    const [trackingNotice, setTrackingNotice] = useState({ type: "", message: "" });

    const [currentPage, setCurrentPage] = useState(1);

    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [sortOrder, setSortOrder] = useState("newest");

    /* ============================================================
       FETCH ORDERS
    ============================================================ */

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/pesanan");

            const data = Array.isArray(response.data?.data)
                ? response.data.data
                : Array.isArray(response.data)
                  ? response.data
                  : [];

            setItems(data);
        } catch (err) {
            console.error("[AdminOrders]", err);

            setError("Gagal memuat pesanan.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    /* ============================================================
       FILTER + SORT
    ============================================================ */

    const filtered = useMemo(() => {
        const search = query.trim().toLowerCase();

        return [...items]
            .filter((order) => {
                if (!search) {
                    return true;
                }

                const orderNumber = String(order.nomorPesanan ?? order.id ?? "").toLowerCase();

                const customer = String(
                    order.userName ?? order.customerName ?? order.email ?? "",
                ).toLowerCase();

                return orderNumber.includes(search) || customer.includes(search);
            })
            .sort((a, b) => {
                const dateA = new Date(a.createdAt || 0).getTime();

                const dateB = new Date(b.createdAt || 0).getTime();

                return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
            });
    }, [items, query, sortOrder]);

    /* ============================================================
       SUMMARY
    ============================================================ */

    const orderSummary = useMemo(() => {
        return items.reduce(
            (summary, order) => {
                const key = getStatusKey(order.status);

                if (key === "pending") {
                    summary.pending++;
                }

                if (key === "processing") {
                    summary.processing++;
                }

                if (key === "shipped") {
                    summary.shipped++;
                }

                if (key === "completed") {
                    summary.completed++;
                }

                return summary;
            },
            {
                pending: 0,
                processing: 0,
                shipped: 0,
                completed: 0,
            },
        );
    }, [items]);

    /* ============================================================
       PAGINATION
    ============================================================ */

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

    const startIndex = (currentPage - 1) * itemsPerPage;

    const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);

    const currentItems = filtered.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    /* ============================================================
       DETAIL
    ============================================================ */

    const openDetail = (order) => {
        setSelectedOrder(order);

        setTempStatus(order.status || "PENDING");

        setTempResi(order.nomorResi || "");

        setTrackingNotice({ type: "", message: "" });
    };

    const closeDetail = () => {
        setSelectedOrder(null);

        setTrackingNotice({ type: "", message: "" });
    };

    /* ============================================================
       LANJUTKAN TRACKING
    ============================================================ */

    const lanjutkanTracking = async () => {
        if (!selectedOrder) {
            return;
        }

        setTrackingLoading(true);
        setTrackingNotice({ type: "", message: "" });

        try {
            const res = await api.post(`/api/tracking/${selectedOrder.id}/lanjutkan`);

            setTrackingNotice({
                type: "success",
                message: res.data?.message || "Tracking dimajukan ke tahap berikutnya.",
            });

            fetchOrders();
        } catch (err) {
            setTrackingNotice({
                type: "error",
                message: err.response?.data?.message || "Gagal memajukan tracking.",
            });
        } finally {
            setTrackingLoading(false);
        }
    };

    /* ============================================================
       UPDATE STATUS
    ============================================================ */

    const saveChanges = async () => {
        if (!selectedOrder) {
            return;
        }

        try {
            await api.put(`/api/pesanan/${selectedOrder.id}/status`, {
                status: tempStatus,
                nomorResi: tempResi,
            });

            setItems((prev) =>
                prev.map((order) =>
                    order.id === selectedOrder.id
                        ? {
                              ...order,
                              status: tempStatus,
                          }
                        : order,
                ),
            );

            setSelectedOrder(null);
        } catch (err) {
            console.error("[AdminOrders] Update status error:", err);

            setError("Gagal menyimpan perubahan.");

            setTimeout(() => {
                setError("");
            }, 4000);
        }
    };

    return {
        query,
        setQuery,
        items,
        loading,
        error,
        orderSummary,
        sortOrder,
        setSortOrder,
        itemsPerPage,
        setItemsPerPage,
        selectedOrder,
        tempStatus,
        setTempStatus,
        tempResi,
        setTempResi,
        trackingLoading,
        trackingNotice,
        filtered,
        currentPage,
        setCurrentPage,
        totalPages,
        startIndex,
        endIndex,
        currentItems,
        goToPage,
        fetchOrders,
        openDetail,
        closeDetail,
        saveChanges,
        lanjutkanTracking,
    };
}
