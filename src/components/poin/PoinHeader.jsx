import { Coins } from "lucide-react";

export default function PoinHeader() {
    return (
        <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Coins className="w-5 h-5" />
            </span>

            <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Poin Loyalitas</h1>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Kumpulkan poin dari setiap pembelian dan tukarkan menjadi voucher diskon.
                </p>
            </div>
        </div>
    );
}
