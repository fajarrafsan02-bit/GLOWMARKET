import { ShoppingBag } from "lucide-react";

export default function EmptyOrders({ query }) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl py-14 px-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-gray-400" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                Tidak ada pesanan
            </h3>

            <p className="mt-1 text-xs text-gray-400">
                {query
                    ? `Tidak ditemukan pesanan untuk "${query}".`
                    : "Belum ada pesanan yang tersedia."}
            </p>
        </div>
    );
}
