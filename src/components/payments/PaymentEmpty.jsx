import { Receipt } from "lucide-react";

export default function PaymentEmpty() {
    return (
        <div className="py-16 px-6 text-center border border-dashed border-gray-300 dark:border-gray-700">
            <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Receipt className="w-7 h-7 text-gray-400" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                Belum ada transaksi
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Riwayat pembayaran Anda akan muncul di sini.
            </p>
        </div>
    );
}
