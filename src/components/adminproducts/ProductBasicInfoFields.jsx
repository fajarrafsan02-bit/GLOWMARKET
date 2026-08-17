import { SectionLabel, FieldLabel, inputClass, textareaClass } from "./formControls.jsx";

export default function ProductBasicInfoFields({ form, onChange }) {
    return (
        <div>
            <SectionLabel>Informasi Produk</SectionLabel>

            <div className="mt-3">
                <FieldLabel>Nama Produk</FieldLabel>

                <input
                    type="text"
                    value={form.nama}
                    onChange={(event) =>
                        onChange({
                            ...form,
                            nama: event.target.value,
                        })
                    }
                    required
                    placeholder="Contoh: Cincin Emas 24K"
                    className={inputClass}
                />
            </div>

            <div className="mt-3">
                <FieldLabel>
                    Deskripsi
                    <span className="ml-1.5 font-normal text-gray-400">opsional</span>
                </FieldLabel>

                <textarea
                    value={form.deskripsi || ""}
                    onChange={(event) =>
                        onChange({
                            ...form,
                            deskripsi: event.target.value,
                        })
                    }
                    rows={4}
                    placeholder="Motif, ukuran, atau cara perawatan — 2–4 kalimat cukup."
                    className={textareaClass}
                />
            </div>
        </div>
    );
}
