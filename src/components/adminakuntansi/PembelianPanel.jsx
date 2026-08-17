import { Plus, X, ShoppingCart, CreditCard, CheckCircle2 } from "lucide-react";

import { Peringatan } from "./LaporanCard.jsx";

import usePembelianForm from "../../hooks/usePembelianForm.js";

import PembelianForm from "./pembelian/PembelianForm.jsx";
import PembelianHistoryTable from "./pembelian/PembelianHistoryTable.jsx";
import SummaryCard from "./pembelian/SummaryCard.jsx";

/**
 * Pencatatan pembelian stok.
 *
 * Logic / business flow TIDAK DIUBAH.
 */
export default function PembelianPanel({ data, produkList, onSubmit, onCancel, onLunasi, saving }) {
    const daftar = Array.isArray(data) ? data : [];

    const {
        showForm,
        setShowForm,
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
    } = usePembelianForm(onSubmit);

    return (
        <div className="space-y-4">
            <Peringatan>
                Buat produk terlebih dahulu dengan stok 0, kemudian catat pembelian di sini.
                Pembelian tunai langsung mengurangi kas, sedangkan pembelian kredit dicatat sebagai
                Utang Usaha sampai dilunasi. Stok tidak perlu diubah manual dari form produk.
            </Peringatan>

            {/* Header Action */}
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Pembelian Stok
                    </h2>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                        Catat barang masuk dan harga modal produk.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowForm((buka) => !buka)}
                    className="h-9 px-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-semibold inline-flex items-center gap-1.5 transition shadow-sm hover:shadow"
                >
                    {showForm ? (
                        <>
                            <X className="w-3.5 h-3.5" />
                            Tutup
                        </>
                    ) : (
                        <>
                            <Plus className="w-3.5 h-3.5" />
                            Catat Pembelian
                        </>
                    )}
                </button>
            </div>

            {showForm && (
                <PembelianForm
                    tanggal={tanggal}
                    setTanggal={setTanggal}
                    pemasok={pemasok}
                    setPemasok={setPemasok}
                    catatan={catatan}
                    setCatatan={setCatatan}
                    metode={metode}
                    setMetode={setMetode}
                    items={items}
                    ubahItem={ubahItem}
                    tambahBaris={tambahBaris}
                    hapusBaris={hapusBaris}
                    total={total}
                    simpan={simpan}
                    saving={saving}
                    produkList={produkList}
                />
            )}

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <SummaryCard
                    icon={ShoppingCart}
                    label="Total Pembelian"
                    value={`${daftar.length} transaksi`}
                />

                <SummaryCard icon={CreditCard} label="Metode" value="Tunai / Kredit" />

                <SummaryCard icon={CheckCircle2} label="Periode" value="Riwayat aktif" />
            </div>

            {/* History */}
            <PembelianHistoryTable
                daftar={daftar}
                saving={saving}
                onLunasi={onLunasi}
                onCancel={onCancel}
            />
        </div>
    );
}
