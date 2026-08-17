import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/Axios.jsx";

export const formatRp = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);

export const EMPTY_FORM = {
    kode: "",
    jenis: "PERSEN",
    nilai: "",
    minBelanja: "",
    maksDiskon: "",
    kuota: "",
    aktif: true,
    berlakuDari: "",
    berlakuSampai: "",
};

export default function useAdminVouchers() {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/admin/vouchers");
            setVouchers(Array.isArray(res.data?.data) ? res.data.data : []);
        } catch {
            setError("Gagal memuat voucher.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const openCreate = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const openEdit = (v) => {
        setEditing(v);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const toggle = async (v) => {
        try {
            await api.patch(`/api/admin/vouchers/${v.id}/toggle`);
            load();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal mengubah status voucher.");
        }
    };

    const remove = async (v) => {
        if (!window.confirm(`Hapus voucher ${v.kode}?`)) return;

        try {
            await api.delete(`/api/admin/vouchers/${v.id}`);
            load();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menghapus voucher.");
        }
    };

    const filtered = useMemo(
        () => vouchers.filter((v) => v.kode.toLowerCase().includes(search.toLowerCase())),
        [vouchers, search],
    );

    return {
        vouchers,
        loading,
        search,
        setSearch,
        modalOpen,
        editing,
        error,
        filtered,
        openCreate,
        openEdit,
        closeModal,
        toggle,
        remove,
        load,
    };
}
