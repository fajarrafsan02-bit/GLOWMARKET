import { useCallback, useEffect, useRef, useState } from "react";

import api from "../api/Axios.jsx";

export default function useOngkirSettings({ onNotify }) {
    const onNotifyRef = useRef(onNotify);

    useEffect(() => {
        onNotifyRef.current = onNotify;
    });

    const [rows, setRows] = useState([]);

    const [drafts, setDrafts] = useState({});

    const [loading, setLoading] = useState(true);

    const [savingId, setSavingId] = useState(null);

    const [creating, setCreating] = useState(false);

    const [newRow, setNewRow] = useState({
        provinsi: "",
        tarif: "",
        estimasiHari: "",
    });

    const fetchOngkir = useCallback(async () => {
        try {
            setLoading(true);

            const response = await api.get("/api/ongkir");

            const data = response?.data?.data || [];

            setRows(data);

            const nextDrafts = {};

            data.forEach((item) => {
                nextDrafts[item.id] = {
                    tarif: String(item.tarif ?? 0),
                    estimasiHari: item.estimasiHari == null ? "" : String(item.estimasiHari),
                };
            });

            setDrafts(nextDrafts);
        } catch (error) {
            console.error("[Settings] Ongkir error:", error);

            onNotifyRef.current?.("error", error.message || "Gagal memuat tarif ongkir");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOngkir();
    }, [fetchOngkir]);

    const setDraft = (id, field, value) =>
        setDrafts((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));

    const isDirty = (row) => {
        const draft = drafts[row.id];

        if (!draft) return false;

        const currentEstimasi = row.estimasiHari == null ? "" : String(row.estimasiHari);

        return draft.tarif !== String(row.tarif ?? 0) || draft.estimasiHari !== currentEstimasi;
    };

    const handleUpdate = async (row) => {
        const draft = drafts[row.id];

        const tarif = Number(draft.tarif);

        if (draft.tarif === "" || Number.isNaN(tarif) || tarif < 0) {
            onNotifyRef.current?.("error", "Tarif harus berupa angka dan tidak boleh negatif");
            return;
        }

        try {
            setSavingId(row.id);

            await api.put(`/api/ongkir/${row.id}`, {
                tarif,
                estimasiHari: draft.estimasiHari === "" ? null : Number(draft.estimasiHari),
            });

            await fetchOngkir();

            onNotifyRef.current?.("success", `Tarif ${row.provinsi} berhasil disimpan`);
        } catch (error) {
            console.error("[Settings] Update ongkir error:", error);

            onNotifyRef.current?.("error", error.message || "Gagal menyimpan tarif ongkir");
        } finally {
            setSavingId(null);
        }
    };

    const handleDelete = async (row) => {
        const confirmed = window.confirm(`Hapus tarif ongkir untuk ${row.provinsi}?`);

        if (!confirmed) return;

        try {
            setSavingId(row.id);

            await api.delete(`/api/ongkir/${row.id}`);

            await fetchOngkir();

            onNotifyRef.current?.("success", `Tarif ${row.provinsi} dihapus`);
        } catch (error) {
            console.error("[Settings] Delete ongkir error:", error);

            onNotifyRef.current?.("error", error.message || "Gagal menghapus tarif ongkir");
        } finally {
            setSavingId(null);
        }
    };

    const handleCreate = async (event) => {
        event.preventDefault();

        if (!newRow.provinsi.trim()) {
            onNotifyRef.current?.("error", "Nama provinsi harus diisi");
            return;
        }

        const tarif = Number(newRow.tarif);

        if (newRow.tarif === "" || Number.isNaN(tarif) || tarif < 0) {
            onNotifyRef.current?.("error", "Tarif harus berupa angka dan tidak boleh negatif");
            return;
        }

        try {
            setCreating(true);

            await api.post("/api/ongkir", {
                provinsi: newRow.provinsi.trim(),
                tarif,
                estimasiHari: newRow.estimasiHari === "" ? null : Number(newRow.estimasiHari),
            });

            setNewRow({
                provinsi: "",
                tarif: "",
                estimasiHari: "",
            });

            await fetchOngkir();

            onNotifyRef.current?.("success", "Tarif ongkir berhasil ditambahkan");
        } catch (error) {
            console.error("[Settings] Create ongkir error:", error);

            onNotifyRef.current?.("error", error.message || "Gagal menambah tarif ongkir");
        } finally {
            setCreating(false);
        }
    };

    return {
        rows,
        drafts,
        loading,
        savingId,
        creating,
        newRow,
        setNewRow,
        fetchOngkir,
        setDraft,
        isDirty,
        handleUpdate,
        handleDelete,
        handleCreate,
    };
}
