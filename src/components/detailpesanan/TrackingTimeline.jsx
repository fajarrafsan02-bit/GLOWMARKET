import { useEffect, useState } from "react";
import {
    PackageSearch,
    Loader2,
    Box,
    Truck,
    MapPin,
    PackageCheck,
    ChevronRight,
    Home,
} from "lucide-react";

import api from "../../api/Axios.jsx";

const STATUS_ORDER = [
    { key: "DIPROSES", label: "Diproses di Gudang", icon: Box },
    { key: "DALAM_PERJALANAN", label: "Dalam Perjalanan", icon: Truck },
    { key: "SAMPAI_KOTA_TUJUAN", label: "Sampai Kota Tujuan", icon: MapPin },
    { key: "OUT_FOR_DELIVERY", label: "Diantar Kurir", icon: ChevronRight },
    { key: "DITERIMA", label: "Diterima", icon: Home },
];

const formatTanggal = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function TrackingTimeline({ pesananId, resi }) {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let aktif = true;

        const load = async () => {
            if (!pesananId) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(`/api/tracking/${pesananId}`);
                if (aktif) {
                    setTimeline(Array.isArray(res.data?.data) ? res.data.data : []);
                }
            } catch {
                if (aktif) {
                    setTimeline([]);
                }
            } finally {
                if (aktif) {
                    setLoading(false);
                }
            }
        };

        load();
        return () => {
            aktif = false;
        };
    }, [pesananId]);

    if (loading) {
        return (
            <section className="mt-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-sm">
                <div className="p-8 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                </div>
            </section>
        );
    }

    if (timeline.length === 0) {
        return null;
    }

    const terakhir = timeline[timeline.length - 1];
    const statusTerakhir = String(terakhir.status || "").toUpperCase();
    const tahapTerakhir = STATUS_ORDER.find((s) => s.key === statusTerakhir);

    const iconFor = (item) => {
        const s = STATUS_ORDER.find((x) => x.key === String(item.status || "").toUpperCase());
        return s ? s.icon : PackageSearch;
    };

    return (
        <section className="mt-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-sm">
            <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <PackageSearch className="w-4 h-4 text-amber-500" />

                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Lacak Paket
                        </h2>
                    </div>

                    {resi && (
                        <p className="text-[11px] text-gray-400">
                            Nomor Resi:{" "}
                            <span className="font-mono font-semibold text-gray-700 dark:text-gray-300 select-all">
                                {resi}
                            </span>
                        </p>
                    )}
                </div>
            </div>

            <div className="px-4 sm:px-6 py-5">
                {tahapTerakhir && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Status terbaru:{" "}
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                            {tahapTerakhir.label}
                        </span>
                    </p>
                )}

                <ol className="mt-4 space-y-0">
                    {[...timeline].reverse().map((item, index) => {
                        const Icon = iconFor(item);
                        const isLast = index === 0;
                        return (
                            <li key={item.id || index} className="relative flex gap-3 pb-6 last:pb-0">
                                {!isLast && (
                                    <span className="absolute left-[13px] top-7 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                                )}

                                <div
                                    className={` relative z-10 w-7 h-7 shrink-0 rounded-full flex items-center justify-center ${isLast ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400"} `}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className={` text-xs font-semibold ${isLast ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"} `}
                                    >
                                        {item.keterangan}
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-gray-400">
                                        {item.lokasi}
                                        {item.updatedAt
                                            ? ` • ${formatTanggal(item.updatedAt)}`
                                            : ""}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
