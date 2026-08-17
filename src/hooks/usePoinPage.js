import { useCallback, useEffect, useState } from "react";

import api from "../api/Axios.jsx";

export default function usePoinPage({ isAuthenticated }) {
    const [showAuth, setShowAuth] = useState(false);

    const [saldo, setSaldo] = useState(0);
    const [totalDiperoleh, setTotalDiperoleh] = useState(0);
    const [totalDipakai, setTotalDipakai] = useState(0);
    const [riwayat, setRiwayat] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [voucherPublik, setVoucherPublik] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [jumlahPoin, setJumlahPoin] = useState(100);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [success, setSuccess] = useState("");
    const [copiedKode, setCopiedKode] = useState("");

    const loadPoin = useCallback(async () => {
        if (!isAuthenticated) {
            setRiwayat([]);
            setVouchers([]);
            setVoucherPublik([]);
            setSaldo(0);
            return;
        }
        try {
            setLoading(true);
            const [poinRes, publikRes] = await Promise.all([
                api.get("/api/poin"),
                api.get("/api/vouchers/public").catch(() => null),
            ]);
            const data = poinRes.data?.data;
            setSaldo(data?.saldoPoin || 0);
            setTotalDiperoleh(data?.totalDiperoleh || 0);
            setTotalDipakai(data?.totalDipakai || 0);
            setRiwayat(Array.isArray(data?.riwayat) ? data.riwayat : []);
            setVouchers(Array.isArray(data?.vouchers) ? data.vouchers : []);
            setVoucherPublik(
                Array.isArray(publikRes?.data?.data) ? publikRes.data.data : [],
            );
        } catch {
            setError("Gagal memuat data poin.");
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            loadPoin();
        }
    }, [isAuthenticated, loadPoin]);

    const tukar = async () => {
        const jumlah = Number(jumlahPoin);
        if (!Number.isFinite(jumlah) || jumlah < 100 || jumlah % 100 !== 0) {
            setSubmitError("Jumlah poin minimal 100 dan kelipatan 100.");
            return;
        }
        if (jumlah > saldo) {
            setSubmitError("Saldo poin tidak mencukupi.");
            return;
        }

        setSubmitting(true);
        setSubmitError("");
        setSuccess("");
        try {
            const res = await api.post("/api/poin/tukar", { jumlahPoin: jumlah });
            setSuccess(res.data?.message || "Poin berhasil ditukar menjadi voucher.");
            setJumlahPoin(100);
            await loadPoin();
        } catch (err) {
            setSubmitError(err.response?.data?.message || "Gagal menukar poin.");
        } finally {
            setSubmitting(false);
        }
    };

    const salinKode = async (kode) => {
        try {
            await navigator.clipboard.writeText(kode);
            setCopiedKode(kode);
            setTimeout(() => setCopiedKode(""), 2000);
        } catch {
            setCopiedKode("");
        }
    };

    return {
        showAuth,
        setShowAuth,
        saldo,
        totalDiperoleh,
        totalDipakai,
        riwayat,
        vouchers,
        voucherPublik,
        loading,
        error,
        jumlahPoin,
        setJumlahPoin,
        submitting,
        submitError,
        success,
        copiedKode,
        tukar,
        salinKode,
    };
}
