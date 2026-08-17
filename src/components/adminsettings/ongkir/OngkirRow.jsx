import { Save, Trash2 } from "lucide-react";

import { inputClass } from "./classes.js";

export default function OngkirRow({ row, draft, dirty, busy, onDraftChange, onSave, onDelete }) {
    return (
        <tr className="border-b border-gray-50 dark:border-gray-800/60">
            <td className="px-4 sm:px-5 py-2 text-xs font-medium text-gray-700 dark:text-gray-200">
                {row.provinsi}
            </td>

            <td className="px-3 py-2">
                <input
                    type="number"
                    min={0}
                    value={draft.tarif}
                    onChange={(event) => onDraftChange("tarif", event.target.value)}
                    className={inputClass}
                />
            </td>

            <td className="px-3 py-2">
                <input
                    type="number"
                    min={0}
                    value={draft.estimasiHari}
                    onChange={(event) => onDraftChange("estimasiHari", event.target.value)}
                    placeholder="-"
                    className={inputClass}
                />
            </td>

            <td className="px-3 py-2">
                <div className="flex items-center justify-end gap-1.5">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={!dirty || busy}
                        className="h-8 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-semibold flex items-center gap-1 disabled:opacity-40 disabled:hover:bg-amber-500"
                    >
                        <Save className="w-3 h-3" />
                        Simpan
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={busy}
                        className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-800 text-red-500 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-40"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
