import {
    Plus,
    X,
    CreditCard,
    CalendarDays,
    Building2,
    FileText,
    Wallet,
} from "lucide-react";

import { formatPrice } from "../../../utils/format.js";
import { Panel } from "../LaporanCard.jsx";

import { Field, inputClass } from "../controls.jsx";
import PurchaseItemRow from "./PurchaseItemRow.jsx";

export default function PembelianForm({
    tanggal,
    setTanggal,
    pemasok,
    setPemasok,
    catatan,
    setCatatan,
    metode,
    setMetode,
    items,
    ubahItem,
    tambahBaris,
    hapusBaris,
    total,
    simpan,
    saving,
    produkList,
}) {
    return (
        <form onSubmit={simpan}>
            <Panel
                title="Pembelian Stok Baru"
                subtitle="Stok dan harga modal akan ikut diperbarui berdasarkan transaksi ini."
            >
                <div className="p-3 sm:p-5 space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                        <Field label="Tanggal">
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />

                                <input
                                    type="date"
                                    value={tanggal}
                                    onChange={(event) => setTanggal(event.target.value)}
                                    required
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </Field>

                        <Field label="Pemasok">
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />

                                <input
                                    type="text"
                                    value={pemasok}
                                    onChange={(event) => setPemasok(event.target.value)}
                                    placeholder="Nama toko / pemasok"
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </Field>

                        <Field label="Pembayaran">
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />

                                <select
                                    value={metode}
                                    onChange={(event) => setMetode(event.target.value)}
                                    className={`${inputClass} pl-9`}
                                >
                                    <option value="TUNAI">Tunai — kas keluar</option>

                                    <option value="KREDIT">Kredit — utang pemasok</option>
                                </select>
                            </div>
                        </Field>

                        <Field label="Catatan">
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />

                                <input
                                    type="text"
                                    value={catatan}
                                    onChange={(event) => setCatatan(event.target.value)}
                                    placeholder="Catatan opsional"
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </Field>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2.5">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-gray-400">
                                    Detail Produk
                                </p>

                                <p className="mt-0.5 text-[10px] text-gray-400">
                                    Masukkan produk, jumlah, dan harga beli per unit.
                                </p>
                            </div>

                            <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[9px] font-medium text-gray-500 dark:text-gray-400">
                                {items.length} baris
                            </span>
                        </div>

                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <PurchaseItemRow
                                    key={index}
                                    item={item}
                                    index={index}
                                    produkList={produkList}
                                    onChange={ubahItem}
                                    onRemove={() => hapusBaris(index)}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={tambahBaris}
                            className="mt-2 h-8 px-2.5 rounded-md text-[10px] font-semibold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 dark:text-amber-400 inline-flex items-center gap-1 transition"
                        >
                            <Plus className="w-3 h-3" />
                            Tambah Barang
                        </button>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.1em] text-gray-400 font-semibold">
                                Total Pembelian
                            </p>

                            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                                {formatPrice(total)}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-[9px] text-gray-500 dark:text-gray-400">
                                <Wallet className="w-3 h-3" />

                                {metode === "KREDIT" ? "Utang Usaha" : "Kas"}
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="h-9 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-[11px] font-semibold transition"
                            >
                                {saving ? "Menyimpan..." : "Simpan Pembelian"}
                            </button>
                        </div>
                    </div>
                </div>
            </Panel>
        </form>
    );
}
