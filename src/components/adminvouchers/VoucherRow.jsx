import { Tag, ToggleRight, ToggleLeft, Pencil, Trash2 } from "lucide-react";

import { formatRp } from "../../hooks/useAdminVouchers.js";
import VoucherStatusBadge from "./VoucherStatusBadge.jsx";

export default function VoucherRow({ v, onToggle, onEdit, onDelete }) {
    return (
        <div className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                <Tag className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-amber-600 dark:text-amber-400" />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white uppercase">
                        {v.kode}
                    </p>
                    <VoucherStatusBadge v={v} />
                </div>

                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {v.jenis === "PERSEN"
                        ? `Diskon ${Number(v.nilai)}%`
                        : `Diskon ${formatRp(v.nilai)}`}
                    {v.minBelanja ? ` • Min ${formatRp(v.minBelanja)}` : ""}
                    {v.jenis === "PERSEN" && v.maksDiskon
                        ? ` • Maks ${formatRp(v.maksDiskon)}`
                        : ""}
                </p>

                {v.kuota != null && (
                    <p className="mt-0.5 text-[11px] text-gray-400">
                        Terpakai {v.terpakai || 0} / {v.kuota}
                    </p>
                )}
            </div>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 shrink-0 ml-auto sm:ml-0">
                <button
                    type="button"
                    onClick={() => onToggle(v)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    title={v.aktif ? "Nonaktifkan" : "Aktifkan"}
                >
                    {v.aktif ? (
                        <ToggleRight className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-emerald-500" />
                    ) : (
                        <ToggleLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    )}
                </button>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit(v)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        title="Edit"
                    >
                        <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(v)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition"
                        title="Hapus"
                    >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
