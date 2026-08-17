import { ShoppingCart } from "lucide-react";

export default function WishlistToolbar({ count, onAddAll }) {
    return (
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">{count}</span>{" "}
                produk tersimpan
            </p>

            {count > 1 && (
                <button
                    type="button"
                    onClick={onAddAll}
                    className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20 transition"
                >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Tambahkan Semua
                </button>
            )}
        </div>
    );
}
