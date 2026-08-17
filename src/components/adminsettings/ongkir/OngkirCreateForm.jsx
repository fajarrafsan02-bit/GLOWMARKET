import { Plus } from "lucide-react";

import { inputClass } from "./classes.js";

export default function OngkirCreateForm({ newRow, setNewRow, creating, onSubmit }) {
    const updateField = (field) => (event) =>
        setNewRow((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));

    return (
        <form
            onSubmit={onSubmit}
            className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-950/40 grid grid-cols-1 sm:grid-cols-[2fr_1.4fr_1fr_auto] gap-2"
        >
            <input
                value={newRow.provinsi}
                onChange={updateField("provinsi")}
                placeholder="Nama provinsi"
                className={inputClass}
            />

            <input
                type="number"
                min={0}
                value={newRow.tarif}
                onChange={updateField("tarif")}
                placeholder="Tarif (Rp)"
                className={inputClass}
            />

            <input
                type="number"
                min={0}
                value={newRow.estimasiHari}
                onChange={updateField("estimasiHari")}
                placeholder="Estimasi hari"
                className={inputClass}
            />

            <button
                type="submit"
                disabled={creating}
                className="h-8 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
                <Plus className="w-3.5 h-3.5" />
                Tambah
            </button>
        </form>
    );
}
