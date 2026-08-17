import { XCircle, ArrowRight } from "lucide-react";

export default function PaymentExpiredActions({ navigate }) {
    return (
        <div className="mt-6">
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 shrink-0 text-red-500" />

                    <div>
                        <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                            Invoice kedaluwarsa
                        </p>

                        <p className="mt-1 text-xs leading-5 text-red-600 dark:text-red-500">
                            Anda dapat kembali ke keranjang dan melakukan checkout ulang.
                        </p>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={() => navigate("/keranjang")}
                className="w-full h-10 mt-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
            >
                Kembali ke Keranjang
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}
