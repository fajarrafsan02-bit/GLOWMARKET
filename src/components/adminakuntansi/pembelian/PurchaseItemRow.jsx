import { Trash2 } from "lucide-react";

import { formatPrice, toMoney } from "../../../utils/format.js";
import { Field, inputClass } from "../controls.jsx";

export default function PurchaseItemRow({ item, index, produkList, onChange, onRemove }) {
    const produkTerpilih = produkList.find((produk) => String(produk.id) === String(item.produkId));

    const subtotal = toMoney(item.hargaBeli) * (Number(item.qty) || 0);

    const handleProdukChange = (event) => {
        const selectedId = event.target.value;
        const selectedProd = produkList.find((p) => String(p.id) === String(selectedId));

        let defaultHargaBeli = item.hargaBeli;
        if (selectedProd && selectedProd.hargaModal != null) {
            defaultHargaBeli = String(selectedProd.hargaModal);
        }

        onChange(index, {
            produkId: selectedId,
            hargaBeli: defaultHargaBeli,
        });
    };

    return (
        <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30">
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(240px,1fr)_90px_160px_110px_36px] gap-2 items-end">
                {/* Product */}
                <Field label="Produk">
                    <select
                        value={item.produkId}
                        onChange={handleProdukChange}
                        required
                        className={inputClass}
                    >
                        <option value="">Pilih produk</option>

                        {produkList.map((produk) => (
                            <option key={produk.id} value={produk.id}>
                                {produk.nama} (stok {produk.stock})
                            </option>
                        ))}
                    </select>
                </Field>

                {/* Qty */}
                <Field label="Qty">
                    <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(event) =>
                            onChange(index, {
                                qty: event.target.value,
                            })
                        }
                        required
                        className={inputClass}
                    />
                </Field>

                {/* Harga beli */}
                <Field label="Harga / Unit">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                            Rp
                        </span>

                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={item.hargaBeli}
                            onChange={(event) =>
                                onChange(index, {
                                    hargaBeli: event.target.value,
                                })
                            }
                            required
                            placeholder="0"
                            className={`${inputClass} pl-8`}
                        />
                    </div>
                </Field>

                {/* Subtotal */}
                <Field label="Subtotal">
                    <div className="h-9 px-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-end text-xs font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
                        {formatPrice(subtotal)}
                    </div>
                </Field>

                {/* Delete */}
                <button
                    type="button"
                    onClick={onRemove}
                    className="h-9 w-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-900/20 inline-flex items-center justify-center transition"
                    aria-label={`Hapus barang ${index + 1}`}
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>

            {produkTerpilih && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[9px] text-gray-400 leading-relaxed">
                    <span>Stok saat ini:</span>

                    <span className="font-semibold text-gray-600 dark:text-gray-300">
                        {produkTerpilih.stock} pcs
                    </span>

                    <span className="hidden sm:inline">•</span>

                    <span>Harga Modal Terdaftar:</span>

                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {formatPrice(produkTerpilih.hargaModal || 0)}
                    </span>

                    <span className="hidden sm:inline">•</span>

                    <span>Baris {index + 1}</span>
                </div>
            )}
        </div>
    );
}
