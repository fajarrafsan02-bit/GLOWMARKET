export default function UnpaidNotice() {
    return (
        <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-900/10">
            <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                Pesanan belum dibayar
            </p>

            <p className="mt-1 text-[10px] leading-4 text-amber-700/80 dark:text-amber-400/80">
                Pesanan baru bisa dikemas setelah pembayaran lunas. Untuk saat ini status hanya dapat
                diubah menjadi Dibatalkan — stok yang ditahan akan dikembalikan.
            </p>
        </div>
    );
}
