import { Ban, CalendarDays } from "lucide-react";

import { formatPrice } from "../../../utils/format.js";
import { tdClass } from "../LaporanCard.jsx";
import { statusPembelian } from "./PembelianStatus.jsx";

export default function PurchaseHistoryRow({ pembelian, saving, onLunasi, onCancel }) {
    const status = statusPembelian(pembelian);

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
            {/* Date */}
            <td className={`${tdClass} whitespace-nowrap`}>
                <div className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 text-gray-400 shrink-0" />

                    <span className="text-xs">{pembelian.tanggal}</span>
                </div>
            </td>

            {/* Number */}
            <td className={`${tdClass} whitespace-nowrap`}>
                <span className="inline-flex px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-mono font-medium text-gray-600 dark:text-gray-400">
                    {pembelian.nomor}
                </span>
            </td>

            {/* Supplier */}
            <td className={tdClass}>
                <div className="max-w-[160px]">
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                        {pembelian.pemasok || "—"}
                    </p>
                </div>
            </td>

            {/* Payment */}
            <td className={tdClass}>
                <div>
                    <span className="block text-[11px] font-semibold text-gray-800 dark:text-gray-200">
                        {pembelian.metode === "KREDIT" ? "Kredit" : "Tunai"}
                    </span>

                    <span
                        className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[9px] font-semibold ${status.warnaBg} ${status.warnaText}`}
                    >
                        {status.icon}

                        {status.label}
                    </span>
                </div>
            </td>

            {/* Items */}
            <td className={tdClass}>
                <div className="space-y-0.5 min-w-[190px]">
                    {pembelian.items.map((item, index) => (
                        <div key={index} className="text-[10px] text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                                {item.namaProduk}
                            </span>{" "}
                            × {item.qty}
                        </div>
                    ))}
                </div>
            </td>

            {/* Total */}
            <td className={`${tdClass} text-right whitespace-nowrap`}>
                <span className="text-xs font-bold text-gray-900 dark:text-white tabular-nums">
                    {formatPrice(pembelian.total)}
                </span>
            </td>

            {/* Actions */}
            <td className={`${tdClass} text-right`}>
                {pembelian.dibatalkan ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[9px] font-semibold text-gray-400">
                        <Ban className="w-3 h-3" />
                        Dibatalkan
                    </span>
                ) : (
                    <div className="flex flex-col items-end gap-1.5">
                        {pembelian.metode === "KREDIT" && !pembelian.dilunasi && (
                            <button
                                type="button"
                                onClick={() => onLunasi(pembelian)}
                                disabled={saving}
                                className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-[10px] font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Lunasi
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => onCancel(pembelian)}
                            className="text-[10px] font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300"
                        >
                            Batalkan
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}
