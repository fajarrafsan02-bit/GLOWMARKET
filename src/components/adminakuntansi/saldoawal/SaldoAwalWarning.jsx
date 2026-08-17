import { AlertTriangle } from "lucide-react";

export default function SaldoAwalWarning({ produkTanpaModal, totalProduk }) {
    return (
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-900/10 px-4 py-3">
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>

                <div>
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                        Harga modal produk belum lengkap
                    </p>

                    <p className="mt-1 text-[10px] leading-relaxed text-amber-700 dark:text-amber-400">
                        {produkTanpaModal} dari {totalProduk} produk belum diisi harga modalnya,
                        sehingga nilai persediaan awal dihitung nol.
                    </p>

                    <p className="mt-1 text-[10px] leading-relaxed text-amber-700 dark:text-amber-400 opacity-80">
                        Isi Harga Modal di halaman Produk terlebih dahulu agar nilai persediaan awal
                        akurat.
                    </p>
                </div>
            </div>
        </div>
    );
}
