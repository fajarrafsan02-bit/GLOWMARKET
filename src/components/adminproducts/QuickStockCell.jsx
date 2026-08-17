/**
 * Stok di halaman produk hanya ditampilkan.
 * Naik lewat Akuntansi → Pembelian, turun lewat penjualan.
 */
export default function QuickStockCell({ stock, outOfStock, lowStock }) {
    return (
        <div title="Stok tidak diubah di sini. Barang masuk: Akuntansi → Pembelian. Barang keluar: penjualan.">
            <p
                className={` text-xs font-semibold ${outOfStock ? "text-red-600 dark:text-red-400" : lowStock ? "text-amber-600 dark:text-amber-400" : "text-gray-800 dark:text-gray-200"} `}
            >
                {stock} pcs
            </p>

            <p
                className={` mt-0.5 text-[9px] ${outOfStock ? "text-red-500" : lowStock ? "text-amber-500" : "text-gray-400"} `}
            >
                {outOfStock ? "Habis" : lowStock ? "Menipis" : "Aman"}
            </p>
        </div>
    );
}
