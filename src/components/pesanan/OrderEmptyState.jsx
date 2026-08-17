import { Package, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderEmptyState() {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 py-20 px-6 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Package className="w-7 h-7 text-gray-400" />
            </div>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Belum ada pesanan
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Temukan perhiasan favorit Anda dan mulai berbelanja.
            </p>

            <Link
                to="/katalog"
                className="mt-6 inline-flex items-center gap-2 h-10 px-5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
            >
                Mulai Belanja
                <ChevronRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
