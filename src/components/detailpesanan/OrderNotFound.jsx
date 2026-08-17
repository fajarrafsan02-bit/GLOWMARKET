import { Link } from "react-router-dom";
import { Package, ChevronLeft } from "lucide-react";

export default function OrderNotFound({ error }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <Package className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                    Pesanan Tidak Ditemukan
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    {error || "Nomor pesanan tidak valid atau belum tersedia."}
                </p>
                <Link
                    to="/pesanan"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white font-medium transition"
                >
                    <ChevronLeft className="w-5 h-5" /> Kembali ke Pesanan
                </Link>
            </div>
        </div>
    );
}
