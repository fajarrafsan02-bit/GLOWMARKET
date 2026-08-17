import { ChevronRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderPageHeader() {
    return (
        <div className="mb-7">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <Link to="/" className="hover:text-amber-600 transition-colors">
                    Beranda
                </Link>

                <ChevronRight className="w-3 h-3" />

                <span className="text-gray-600 dark:text-gray-300">Pesanan</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        Pesanan Saya
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Kelola dan pantau semua pesanan Anda.
                    </p>
                </div>

                <Link
                    to="/katalog"
                    className="inline-flex items-center justify-center gap-2 h-10 px-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-amber-400 hover:text-amber-600 transition-all"
                >
                    <ShoppingBag className="w-4 h-4" />
                    Belanja Lagi
                </Link>
            </div>
        </div>
    );
}
