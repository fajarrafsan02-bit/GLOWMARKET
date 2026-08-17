import { useCallback, useEffect, useState } from "react";

import api from "../api/Axios.jsx";

export default function usePengembalian({ isAuthenticated }) {
    const [showAuth, setShowAuth] = useState(false);

    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const [formOpen, setFormOpen] = useState(false);
    const [pesananId, setPesananId] = useState("");
    const [alasan, setAlasan] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [success, setSuccess] = useState("");

    const loadReturns = useCallback(async () => {
        if (!isAuthenticated) {
            setReturns([]);
            return;
        }
        try {
            setLoading(true);
            const res = await api.get("/api/pengembalian");
            setReturns(Array.isArray(res.data?.data) ? res.data.data : []);
        } catch {
            setError("Gagal memuat riwayat pengembalian.");
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const loadOrders = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setOrdersLoading(true);
            const res = await api.get("/api/pesanan");
            const arr = Array.isArray(res.data?.data) ? res.data.data : [];
            setOrders(arr);
        } catch (err) {
            console.error("[Pengembalian] Gagal memuat pesanan:", err);
        } finally {
            setOrdersLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            loadReturns();
            loadOrders();
        }
    }, [isAuthenticated, loadReturns, loadOrders]);

    const pesananSelesai = orders.filter((o) => o.status === "SELESAI");

    const submit = async () => {
        if (!pesananId) {
            setSubmitError("Pilih pesanan yang ingin dikembalikan.");
            return;
        }
        if (!alasan.trim()) {
            setSubmitError("Tuliskan alasan pengembalian.");
            return;
        }

        setSubmitting(true);
        setSubmitError("");
        setSuccess("");
        try {
            const res = await api.post("/api/pengembalian", {
                pesananId: Number(pesananId),
                alasan: alasan.trim(),
            });
            setSuccess(res.data?.message || "Pengajuan pengembalian berhasil dibuat.");
            setFormOpen(false);
            setPesananId("");
            setAlasan("");
            loadReturns();
        } catch (err) {
            setSubmitError(err.response?.data?.message || "Gagal mengajukan pengembalian.");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleForm = () => {
        if (!isAuthenticated) {
            setShowAuth(true);
            return;
        }
        setSubmitError("");
        setSuccess("");
        setFormOpen((v) => !v);
    };

    return {
        showAuth,
        setShowAuth,
        returns,
        loading,
        error,
        ordersLoading,
        formOpen,
        pesananId,
        setPesananId,
        alasan,
        setAlasan,
        submitting,
        submitError,
        success,
        pesananSelesai,
        submit,
        toggleForm,
        closeForm: () => setFormOpen(false),
    };
}
