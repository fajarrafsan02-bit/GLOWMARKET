import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TrendingUp, Scale, BookOpen, FileSpreadsheet, ShoppingCart, Receipt, Coins } from "lucide-react";

import api from "../api/Axios.jsx";
import { getLocalDateString } from "../utils/format.js";

export const TABS = [
    { key: "laba-rugi", label: "Laba Rugi", icon: TrendingUp },
    { key: "neraca", label: "Neraca", icon: Scale },
    { key: "buku-besar", label: "Buku Besar", icon: BookOpen },
    { key: "jurnal", label: "Jurnal Umum", icon: FileSpreadsheet },
    { key: "pembelian", label: "Pembelian", icon: ShoppingCart },
    { key: "beban", label: "Biaya Operasional", icon: Receipt },
    { key: "saldo-awal", label: "Saldo Awal", icon: Coins },
];

/* Sama persis dengan enum SumberJurnal di backend. */
export const SUMBER_JURNAL = [
    "PENJUALAN",
    "PEMBELIAN",
    "PELUNASAN",
    "BEBAN",
    "SALDO_AWAL",
    "PENYESUAIAN",
    "REFUND",
    "MANUAL",
];

export const labelFilterClass = `
    mb-1.5
    block
    text-[9px]
    sm:text-[10px]
    uppercase
    tracking-[0.12em]
    font-semibold
    text-gray-400
`;

export const selectFilterClass = `
    w-full
    sm:w-auto
    h-9
    px-2.5
    sm:px-3
    rounded-lg
    border
    border-gray-200
    dark:border-gray-700
    bg-white
    dark:bg-gray-900
    text-[11px]
    sm:text-xs
    text-gray-900
    dark:text-white
    focus:outline-none
    focus:border-amber-500
    transition
`;

const BASE = "/api/admin/akuntansi";

const hariIni = () => getLocalDateString(new Date());

const awalBulanIni = () => {
    const now = new Date();
    return getLocalDateString(new Date(now.getFullYear(), now.getMonth(), 1));
};

export default function useAdminAccounting() {
    const [activeTab, setActiveTab] = useState("laba-rugi");

    const [periode, setPeriode] = useState(() => ({
        mulai: awalBulanIni(),
        sampai: hariIni(),
    }));

    const [kodeAkun, setKodeAkun] = useState("1-100");

    /* Kosong berarti semua sumber. */
    const [sumber, setSumber] = useState("");

    const [akunList, setAkunList] = useState([]);
    const [produkList, setProdukList] = useState([]);

    const [data, setData] = useState(null);
    const [selisih, setSelisih] = useState(0);
    const [saldoAwalInfo, setSaldoAwalInfo] = useState(null);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const toastTimer = useRef(null);

    const gantiTab = (tab) => {
        if (tab === activeTab) return;
        setActiveTab(tab);
        setData(null);
        setLoading(true);
    };

    const notify = useCallback((type, message) => {
        setToast({ type, message });

        if (toastTimer.current) {
            clearTimeout(toastTimer.current);
        }

        toastTimer.current = setTimeout(() => setToast(null), 4000);
    }, []);

    useEffect(() => {
        return () => {
            if (toastTimer.current) {
                clearTimeout(toastTimer.current);
            }
        };
    }, []);

    /* ============================================================
       DATA PENDUKUNG — bagan akun & daftar produk
    ============================================================ */

    useEffect(() => {
        let batal = false;

        const muat = async () => {
            try {
                const [akun, produk] = await Promise.all([
                    api.get(`${BASE}/akun`),
                    api.get("/api/produk"),
                ]);

                if (batal) return;

                setAkunList(akun.data?.data || []);
                setProdukList(produk.data?.data || []);
            } catch (error) {
                if (!batal) {
                    notify("error", error.message || "Gagal memuat bagan akun");
                }
            }
        };

        muat();

        return () => {
            batal = true;
        };
    }, [notify]);

    const akunBeban = useMemo(() => akunList.filter((akun) => akun.tipe === "BEBAN"), [akunList]);

    /* ============================================================
       PEMUATAN PER TAB
    ============================================================ */

    const alamatData = useCallback(() => {
        const rentang = `mulai=${periode.mulai}&sampai=${periode.sampai}`;

        switch (activeTab) {
            case "laba-rugi":
                return `${BASE}/laporan/laba-rugi?${rentang}`;
            case "neraca":
                return `${BASE}/laporan/neraca?sampai=${periode.sampai}`;
            case "buku-besar":
                return `${BASE}/laporan/buku-besar?kodeAkun=${kodeAkun}&${rentang}`;
            case "jurnal":
                return `${BASE}/laporan/jurnal?${rentang}${sumber ? `&sumber=${sumber}` : ""}`;
            case "pembelian":
                return `${BASE}/pembelian?${rentang}`;
            case "beban":
                return `${BASE}/beban?${rentang}`;
            case "saldo-awal":
                return `${BASE}/saldo-awal`;
            default:
                return null;
        }
    }, [activeTab, periode, kodeAkun, sumber]);

    /* Dinaikkan untuk memaksa pemuatan ulang setelah menyimpan sesuatu. */
    const [muatUlang, setMuatUlang] = useState(0);

    useEffect(() => {
        let batal = false;

        const muat = async () => {
            try {
                const res = await api.get(`${BASE}/saldo-awal`);

                if (!batal) {
                    setSaldoAwalInfo(res.data?.data ?? null);
                }
            } catch {
                /* Banner hanya petunjuk; gagal memuat tidak boleh mengganggu laporan. */
            }
        };

        muat();

        return () => {
            batal = true;
        };
    }, [muatUlang]);

    useEffect(() => {
        const url = alamatData();
        if (!url) return;

        /*
         * Permintaan yang sudah tidak relevan diabaikan. Tanpa penanda ini,
         * berpindah tab dengan cepat bisa membuat respons lama tiba belakangan
         * dan mengisi state dengan data berbentuk lain — neraca punya `aset`,
         * laba rugi punya `pendapatan` — sehingga panelnya gagal dirender.
         */
        let batal = false;

        const muat = async () => {
            try {
                // Data tab sebelumnya dibuang dulu, karena bentuknya berbeda
                setData(null);
                setLoading(true);

                const res = await api.get(url);

                if (batal) return;

                setData(res.data?.data ?? null);
                setSelisih(res.data?.selisihDebitKredit ?? 0);
            } catch (error) {
                if (batal) return;

                setData(null);
                notify("error", error.message || "Gagal memuat data akuntansi");
            } finally {
                if (!batal) {
                    setLoading(false);
                }
            }
        };

        muat();

        return () => {
            batal = true;
        };
    }, [alamatData, notify, muatUlang]);

    /* ============================================================
       EXPORT EXCEL
    ============================================================ */

    const exportExcel = async () => {
        const rentang = `mulai=${periode.mulai}&sampai=${periode.sampai}`;

        const url = {
            "laba-rugi": `${BASE}/laporan/laba-rugi/excel?${rentang}`,
            neraca: `${BASE}/laporan/neraca/excel?sampai=${periode.sampai}`,
            "buku-besar": `${BASE}/laporan/buku-besar/excel?kodeAkun=${kodeAkun}&${rentang}`,
            jurnal: `${BASE}/laporan/jurnal/excel?${rentang}${sumber ? `&sumber=${sumber}` : ""}`,
        }[activeTab];

        if (!url) return;

        try {
            const res = await api.get(url, {
                responseType: "blob",
            });

            const berkas = URL.createObjectURL(new Blob([res.data]));

            const tautan = document.createElement("a");

            tautan.href = berkas;
            tautan.download = `${activeTab}-${periode.mulai}-${periode.sampai}.xlsx`;
            document.body.appendChild(tautan);
            tautan.click();
            tautan.remove();

            URL.revokeObjectURL(berkas);
        } catch (error) {
            notify("error", error.message || "Gagal mengunduh berkas Excel");
        }
    };

    /* ============================================================
       AKSI
    ============================================================ */

    const kirim = async (permintaan, pesanBerhasil) => {
        try {
            setSaving(true);

            const res = await permintaan();

            notify("success", res.data?.message || pesanBerhasil);

            // Pemuatan ulang dikerjakan efek di atas, lengkap dengan
            // pembatalan permintaan yang keburu usang
            setMuatUlang((nomor) => nomor + 1);

            return true;
        } catch (error) {
            notify("error", error.message || "Gagal menyimpan");
            return false;
        } finally {
            setSaving(false);
        }
    };

    const simpanPembelian = (payload) =>
        kirim(() => api.post(`${BASE}/pembelian`, payload), "Pembelian tercatat").then(
            async (berhasil) => {
                if (berhasil) {
                    // Stok produk berubah setelah pembelian, jadi daftarnya dimuat ulang
                    const produk = await api.get("/api/produk");
                    setProdukList(produk.data?.data || []);
                }
                return berhasil;
            },
        );

    const batalkanPembelian = (pembelian) => {
        if (
            !window.confirm(
                `Batalkan pembelian ${pembelian.nomor}? Stok akan dikurangi kembali dan dibuatkan jurnal balik.`,
            )
        ) {
            return;
        }

        kirim(
            () => api.delete(`${BASE}/pembelian/${pembelian.id}?alasan=dibatalkan admin`),
            "Pembelian dibatalkan",
        );
    };

    const lunasiPembelian = (pembelian) => {
        if (
            !window.confirm(
                `Lunasi utang ${pembelian.nomor}? Kas akan berkurang sebesar nilai pembelian, stok tidak berubah.`,
            )
        ) {
            return;
        }

        kirim(() => api.post(`${BASE}/pembelian/${pembelian.id}/lunasi`), "Utang dilunasi");
    };

    const simpanBeban = (payload) => kirim(() => api.post(`${BASE}/beban`, payload), "Beban tercatat");

    const batalkanBeban = (beban) => {
        if (!window.confirm(`Batalkan beban "${beban.keterangan}"? Akan dibuatkan jurnal balik.`)) {
            return;
        }

        kirim(
            () => api.delete(`${BASE}/beban/${beban.id}?alasan=dibatalkan admin`),
            "Beban dibatalkan",
        );
    };

    const simpanSaldoAwal = (payload) =>
        kirim(() => api.post(`${BASE}/saldo-awal`, payload), "Saldo awal tercatat");

    /* ============================================================
       RENDER
    ============================================================ */

    const bisaExport = ["laba-rugi", "neraca", "buku-besar", "jurnal"].includes(activeTab);

    const pakaiPeriode = activeTab !== "saldo-awal";

    return {
        activeTab,
        gantiTab,
        periode,
        setPeriode,
        kodeAkun,
        setKodeAkun,
        sumber,
        setSumber,
        akunList,
        akunBeban,
        produkList,
        data,
        selisih,
        saldoAwalInfo,
        loading,
        saving,
        toast,
        exportExcel,
        simpanPembelian,
        batalkanPembelian,
        lunasiPembelian,
        simpanBeban,
        batalkanBeban,
        simpanSaldoAwal,
        bisaExport,
        pakaiPeriode,
    };
}
