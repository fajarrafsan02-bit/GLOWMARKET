import { useCallback, useEffect, useState } from "react";
import api from "../api/Axios.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import ReturnTimeline from "../components/pengembalian/ReturnTimeline.jsx";
import { RotateCcw, Loader2, Check, X, PackageCheck, Search } from "lucide-react";

const formatRp = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);

const STATUS_META = {
    DIAJUKAN: { label: "Diajukan", cls: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
    DISETUJUI: { label: "Disetujui", cls: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
    DITOLAK: { label: "Ditolak", cls: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" },
    DITERIMA: { label: "Diterima", cls: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
};

export default function AdminPengembalianPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/pengembalian/admin", {
                params: filter ? { status: filter } : {},
            });
            setItems(Array.isArray(res.data?.data) ? res.data.data : []);
        } catch {
            setError("Gagal memuat daftar pengembalian.");
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        load();
    }, [load]);

    const aksi = async (item, aksiKey, judul, wajibCatatan = false) => {
        const catatan = wajibCatatan
            ? window.prompt(`${judul}. Catatan untuk pembeli:`)
            : window.prompt(`${judul}. Catatan untuk pembeli (opsional):`);
        if (wajibCatatan && !catatan) return;

        setBusy(true);
        setError("");
        try {
            await api.patch(`/api/pengembalian/${item.id}/${aksiKey}`, { catatan: catatan || "" });
            load();
        } catch (err) {
            setError(err.response?.data?.message || `Gagal ${aksiKey} pengembalian.`);
        } finally {
            setBusy(false);
        }
    };

    const filtered = items.filter((p) =>
        [p.nomorPengembalian, p.nomorPesanan, p.alasan || ""]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase()),
    );

    const tabs = [
        { key: "", label: "Semua" },
        { key: "DIAJUKAN", label: "Diajukan" },
        { key: "DISETUJUI", label: "Disetujui" },
        { key: "DITOLAK", label: "Ditolak" },
        { key: "DITERIMA", label: "Diterima" },
    ];

    return (
        <AdminLayout activeMenu="returns">
            <div className="p-3 sm:p-6 lg:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                            Pengembalian Barang
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Kelola pengajuan retur &amp; refund pembeli
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                    <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                        <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
                            {tabs.map((t) => (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => setFilter(t.key)}
                                    className={`px-3 shrink-0 h-8 rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-colors ${
                                        filter === t.key
                                            ? "bg-amber-500 text-white"
                                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full sm:w-64 sm:ml-auto shrink-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari no retur / pesanan..."
                                className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[11px] sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="w-6 h-6 mx-auto animate-spin text-amber-500" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center">
                            <RotateCcw className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600" />
                            <p className="mt-3 text-sm text-gray-400">Belum ada pengajuan pengembalian</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filtered.map((p) => {
                                const meta = STATUS_META[p.status] || STATUS_META.DIAJUKAN;
                                return (
                                    <div
                                        key={p.id}
                                        className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                                                        {p.nomorPengembalian}
                                                    </p>
                                                    <span className={`text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.cls}`}>
                                                        {meta.label}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                                                    Pesanan #{p.nomorPesanan} • User #{p.userId} • Refund{" "}
                                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                        {formatRp(p.jumlahRefund)}
                                                    </span>
                                                </p>
                                                {p.alasan && (
                                                    <p className="mt-1.5 text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 italic line-clamp-2">
                                                        "{p.alasan}"
                                                    </p>
                                                )}
                                                {p.catatanAdmin && (
                                                    <p className="mt-1 text-[10px] sm:text-[11px] text-gray-400">
                                                        Catatan admin: {p.catatanAdmin}
                                                    </p>
                                                )}
                                                <ReturnTimeline pengembalian={p} />
                                            </div>

                                            {p.status === "DIAJUKAN" && (
                                                <div className="flex items-center gap-1.5 shrink-0 mt-1 sm:mt-0">
                                                    <button
                                                        type="button"
                                                        disabled={busy}
                                                        onClick={() =>
                                                            aksi(p, "setujui", "Setujui pengembalian")
                                                        }
                                                        className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 h-8 sm:h-9 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] sm:text-xs font-semibold transition disabled:opacity-50"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                        Setujui
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={busy}
                                                        onClick={() =>
                                                            aksi(p, "tolak", "Tolak pengembalian", true)
                                                        }
                                                        className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 h-8 sm:h-9 px-3 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[10px] sm:text-xs font-semibold transition disabled:opacity-50"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                        Tolak
                                                    </button>
                                                </div>
                                            )}

                                            {p.status === "DISETUJUI" && (
                                                <div className="mt-1 sm:mt-0 shrink-0">
                                                    <button
                                                        type="button"
                                                        disabled={busy}
                                                        onClick={() => aksi(p, "terima", "Tandai barang diterima")}
                                                        className="w-full sm:w-auto inline-flex justify-center items-center gap-1.5 h-8 sm:h-9 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] sm:text-xs font-semibold transition disabled:opacity-50"
                                                    >
                                                        <PackageCheck className="w-3.5 h-3.5" />
                                                        Barang Diterima <span className="hidden sm:inline">(stok dipulihkan)</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
