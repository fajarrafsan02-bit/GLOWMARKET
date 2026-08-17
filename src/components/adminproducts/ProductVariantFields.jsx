import { SectionLabel, FieldLabel, inputClass } from "./formControls.jsx";

export default function ProductVariantFields({ form, onSetVarian, onAddVarian, onRemoveVarian }) {
    const varian = Array.isArray(form.varian) ? form.varian.filter((v) => !v._removed) : [];

    return (
        <div>
            <SectionLabel>
                Varian
                <span className="ml-1.5 font-normal normal-case text-gray-400">opsional</span>
            </SectionLabel>

            <p className="mt-1.5 text-[10px] text-gray-400 leading-4">
                Kalau produk tersedia dalam beberapa pilihan (mis. ukuran cincin atau gramasi),
                setiap pilihan punya harga, harga modal, dan stok sendiri. Kosongkan bila produk
                tanpa pilihan.
            </p>

            <div className="mt-3 space-y-3">
                {varian.map((v, idx) => (
                    <div
                        key={v.id || `baru-${idx}`}
                        className="rounded-lg border border-gray-200 dark:border-gray-700 p-3"
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-[1fr_110px_110px_70px] gap-2.5">
                            <div className="col-span-2 sm:col-span-1">
                                <FieldLabel>Nama Pilihan</FieldLabel>

                                <input
                                    type="text"
                                    value={v.nama}
                                    onChange={(event) =>
                                        onSetVarian(idx, {
                                            nama: event.target.value,
                                        })
                                    }
                                    required
                                    placeholder="Contoh: Ukuran 16"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <FieldLabel>Harga</FieldLabel>

                                <input
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={v.harga}
                                    onChange={(event) =>
                                        onSetVarian(idx, {
                                            harga: event.target.value,
                                        })
                                    }
                                    required
                                    placeholder="0"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <FieldLabel>Harga Modal</FieldLabel>

                                <input
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={v.hargaModal}
                                    onChange={(event) =>
                                        onSetVarian(idx, {
                                            hargaModal: event.target.value,
                                        })
                                    }
                                    placeholder="0"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <FieldLabel>Stok</FieldLabel>

                                <input
                                    type="number"
                                    min="0"
                                    value={v.stock}
                                    onChange={(event) =>
                                        onSetVarian(idx, {
                                            stock: event.target.value,
                                        })
                                    }
                                    placeholder="0"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between">
                            <label className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                                <input
                                    type="checkbox"
                                    checked={v.aktif !== false}
                                    onChange={(event) =>
                                        onSetVarian(idx, {
                                            aktif: event.target.checked,
                                        })
                                    }
                                    className="w-3.5 h-3.5 accent-amber-500"
                                />
                                Aktif (bisa dibeli)
                            </label>

                            <button
                                type="button"
                                onClick={() => onRemoveVarian(idx)}
                                className="text-[10px] font-medium text-red-500 hover:text-red-600 transition"
                            >
                                {v.id ? "Nonaktifkan" : "Hapus"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={onAddVarian}
                className="mt-3 w-full h-10 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/40 dark:hover:bg-amber-900/10 transition"
            >
                + Tambah Varian
            </button>
        </div>
    );
}
