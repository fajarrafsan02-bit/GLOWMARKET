import { PRODUCT_CATEGORIES } from "../../utils/productCategory.js";

import { SectionLabel, FieldLabel, inputClass } from "./formControls.jsx";

export default function ProductAvailabilityFields({ form, onChange }) {
    return (
        <div>
            <SectionLabel>Ketersediaan</SectionLabel>

            <div className="mt-3">
                <FieldLabel>Kategori</FieldLabel>

                <select
                    value={form.kategori || ""}
                    onChange={(event) =>
                        onChange({
                            ...form,
                            kategori: event.target.value,
                        })
                    }
                    className={inputClass}
                >
                    <option value="">Tanpa kategori</option>

                    {PRODUCT_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <p className="mt-1.5 text-[10px] text-gray-400">
                    Dipakai untuk filter kategori di halaman katalog.
                </p>
            </div>

            <div className="mt-3">
                <FieldLabel>Status Produk</FieldLabel>

                <select
                    value={form.status}
                    onChange={(event) =>
                        onChange({
                            ...form,
                            status: event.target.value,
                        })
                    }
                    className={inputClass}
                >
                    <option value="TERSEDIA">Tersedia</option>

                    <option value="TIDAK_TERSEDIA">Tidak Tersedia</option>

                    <option value="HABIS">Habis</option>
                </select>
            </div>
        </div>
    );
}
