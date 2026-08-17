import { AlertTriangle } from "lucide-react";

import { Peringatan } from "../LaporanCard.jsx";

export default function HppWarning({ penjualanTanpaHpp }) {
    return (
        <Peringatan>
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>

                <div>
                    <p className="text-xs font-semibold">Beberapa penjualan belum memiliki HPP</p>

                    <p className="mt-0.5 text-[10px] leading-relaxed">
                        {penjualanTanpaHpp} penjualan pada periode ini belum punya HPP karena harga
                        modal produknya masih kosong. Laba di bawah dapat terlihat lebih besar
                        daripada yang sebenarnya.
                    </p>

                    <p className="mt-1 text-[10px] leading-relaxed opacity-80">
                        Isi Harga Modal pada form produk lalu catat pembelian berikutnya agar
                        laporan lebih akurat.
                    </p>
                </div>
            </div>
        </Peringatan>
    );
}
