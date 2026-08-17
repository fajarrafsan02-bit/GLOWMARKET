import { AlertTriangle } from "lucide-react";

import { KARAT_BAWAAN } from "../../hooks/useAdminProducts.js";
import { SectionLabel, FieldLabel, inputClass } from "./formControls.jsx";

export default function ProductPriceFields({ form, isEdit, modalBerubah, onChange, onPriceChange, onCostChange }) {
    return (
        <div>
            <SectionLabel>Harga & Spesifikasi</SectionLabel>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                    <FieldLabel>Harga</FieldLabel>

                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                            Rp
                        </span>

                        <input
                            type="text"
                            value={form.harga}
                            onChange={onPriceChange}
                            required
                            inputMode="numeric"
                            placeholder="0"
                            className={`${inputClass} pl-9`}
                        />
                    </div>
                </div>

                {/* Cost price */}
                <div>
                    <FieldLabel>Harga Modal</FieldLabel>

                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                            Rp
                        </span>

                        <input
                            type="text"
                            value={form.hargaModal || ""}
                            onChange={onCostChange}
                            inputMode="numeric"
                            placeholder="0"
                            required={Number(form.stock) > 0}
                            className={`${inputClass} pl-9`}
                        />
                    </div>

                    <p className="mt-1.5 text-[10px] text-gray-400">
                        Wajib supaya HPP dan neraca benar. Harga beli dari pemasok, tidak ditampilkan
                        ke pembeli.
                    </p>

                    {modalBerubah && (
                        <div className="mt-2 flex gap-2 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-2.5">
                            <AlertTriangle className="mt-0.5 w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                            <p className="text-[10px] leading-4 text-amber-800 dark:text-amber-200">
                                Mengubah harga modal tidak menyesuaikan saldo Persediaan di neraca.
                                Nilai baru hanya dipakai HPP penjualan berikutnya dan koreksi stok
                                berikutnya. Pesanan lama tidak berubah.
                            </p>
                        </div>
                    )}
                </div>

                {/* Weight */}
                <div>
                    <FieldLabel>Berat</FieldLabel>

                    <div className="relative">
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={form.beratGram}
                            onChange={(event) =>
                                onChange({
                                    ...form,
                                    beratGram: event.target.value,
                                })
                            }
                            required
                            placeholder="0.00"
                            className={`${inputClass} pr-14`}
                        />

                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                            gram
                        </span>
                    </div>
                </div>

                {/* Stok tidak diubah di form maupun tabel.
                    Masuk: Pembelian. Keluar: penjualan. */}
                <div>
                    <FieldLabel>Stok</FieldLabel>

                    <p className="h-9 px-3 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        {isEdit
                            ? `${Number(form.stock) || 0} pcs`
                            : "0 — ditambah lewat Pembelian"}
                    </p>

                    <p className="mt-1.5 text-[10px] text-gray-400">
                        {isEdit
                            ? "Tidak bisa diubah di halaman produk. Barang dari pemasok dicatat di Akuntansi → Pembelian; stok berkurang saat penjualan lunas."
                            : "Produk baru mulai dari stok 0. Barang yang sudah ada di toko dicatat di Saldo Awal; yang baru dibeli di Akuntansi → Pembelian."}
                    </p>
                </div>

                {/* Karat */}
                <div>
                    <FieldLabel>Karat Emas</FieldLabel>

                    <select
                        value={form.karatEmas || KARAT_BAWAAN}
                        onChange={(event) =>
                            onChange({
                                ...form,
                                karatEmas: Number(event.target.value),
                            })
                        }
                        required
                        className={inputClass}
                    >
                        <option value={14}>14K Gold</option>
                        <option value={18}>18K Gold</option>
                        <option value={22}>22K Gold</option>
                        <option value={24}>24K Gold</option>
                    </select>

                    <p className="mt-1.5 text-[10px] text-gray-400">
                        Pilihan kadar kemurnian emas (hanya 14K, 18K, 22K, atau 24K).
                    </p>
                </div>
            </div>
        </div>
    );
}
