import { CheckCircle2, Receipt, ShoppingBag } from "lucide-react";

export default function PaymentPaidActions({ navigate }) {
    return (
        <div className="mt-6">
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

                    <div>
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                            Pembayaran berhasil
                        </p>

                        <p className="mt-1 text-xs leading-5 text-emerald-600 dark:text-emerald-500">
                            Pesanan Anda telah diterima dan akan segera diproses.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                <button
                    type="button"
                    onClick={() => navigate("/pesanan")}
                    className="h-10 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
                >
                    <Receipt className="w-4 h-4" />
                    Lihat Pesanan
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/katalog")}
                    className="h-10 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                    <ShoppingBag className="w-4 h-4" />
                    Lanjut Belanja
                </button>
            </div>
        </div>
    );
}
