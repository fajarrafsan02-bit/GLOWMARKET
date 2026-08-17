import { useEffect, useState } from "react";
import api from "../api/Axios.jsx";

import { EMPTY_FORM } from "./useAdminVouchers.js";

export default function useVoucherForm({ open, editing, onSaved, onClose }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            if (editing) {
                setForm({
                    kode: editing.kode || "",
                    jenis: editing.jenis || "PERSEN",
                    nilai: editing.nilai ?? "",
                    minBelanja: editing.minBelanja ?? "",
                    maksDiskon: editing.maksDiskon ?? "",
                    kuota: editing.kuota ?? "",
                    aktif: editing.aktif,
                    berlakuDari: editing.berlakuDari ? editing.berlakuDari.slice(0, 16) : "",
                    berlakuSampai: editing.berlakuSampai ? editing.berlakuSampai.slice(0, 16) : "",
                });
            } else {
                setForm(EMPTY_FORM);
            }
            setError("");
        }
    }, [open, editing]);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const setAktif = (e) => setForm((f) => ({ ...f, aktif: e.target.checked }));

    const submit = async () => {
        setSaving(true);
        setError("");

        const payload = {
            kode: form.kode,
            jenis: form.jenis,
            nilai: form.nilai ? Number(form.nilai) : 0,
            minBelanja: form.minBelanja ? Number(form.minBelanja) : null,
            maksDiskon: form.maksDiskon ? Number(form.maksDiskon) : null,
            kuota: form.kuota ? Number(form.kuota) : null,
            aktif: form.aktif,
            berlakuDari: form.berlakuDari ? new Date(form.berlakuDari).toISOString() : null,
            berlakuSampai: form.berlakuSampai ? new Date(form.berlakuSampai).toISOString() : null,
        };

        try {
            if (editing) {
                await api.put(`/api/admin/vouchers/${editing.id}`, payload);
            } else {
                await api.post("/api/admin/vouchers", payload);
            }
            onSaved();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menyimpan voucher");
        } finally {
            setSaving(false);
        }
    };

    return { form, saving, error, set, setAktif, submit };
}
