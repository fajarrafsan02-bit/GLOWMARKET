import { Check, Clock, PackageCheck, XCircle } from "lucide-react";

import { formatDateTime } from "../../utils/format.js";
import { buildReturnTimeline } from "../../utils/pengembalianTimeline.js";

const IKON = {
    DIAJUKAN: Clock,
    DISETUJUI: Check,
    DITOLAK: XCircle,
    DITERIMA: PackageCheck,
};

export default function ReturnTimeline({ pengembalian }) {
    const langkah = buildReturnTimeline(pengembalian);

    return (
        <ol className="mt-4 space-y-0">
            {langkah.map((item, index) => {
                const Icon = IKON[item.key] || Clock;
                const terakhir = index === langkah.length - 1;
                const aktif = item.current || (item.done && terakhir);
                const ditolak = item.key === "DITOLAK";

                return (
                    <li key={item.key} className="relative flex gap-3 pb-5 last:pb-0">
                        {!terakhir && (
                            <span className="absolute left-[13px] top-7 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                        )}

                        <div
                            className={`relative z-10 w-7 h-7 shrink-0 rounded-full flex items-center justify-center ${
                                ditolak
                                    ? "bg-red-500 text-white"
                                    : item.done
                                      ? "bg-amber-500 text-white"
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                        </div>

                        <div className="min-w-0 pt-0.5 sm:pt-1">
                            <p
                                className={`text-[11px] sm:text-xs font-semibold ${
                                    ditolak
                                        ? "text-red-600 dark:text-red-400"
                                        : aktif
                                          ? "text-gray-900 dark:text-white"
                                          : item.done
                                            ? "text-gray-700 dark:text-gray-300"
                                            : "text-gray-400"
                                }`}
                            >
                                {item.label}
                            </p>

                            {item.at ? (
                                <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-400">
                                    {formatDateTime(item.at)}
                                </p>
                            ) : item.hint ? (
                                <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-400">{item.hint}</p>
                            ) : !item.done ? (
                                <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-400">Menunggu</p>
                            ) : null}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
