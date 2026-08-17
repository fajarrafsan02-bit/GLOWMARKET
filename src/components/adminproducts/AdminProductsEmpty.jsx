import { Package, Plus } from "lucide-react";

export default function AdminProductsEmpty({ onCreate, hasSearch = false }) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl py-16 px-5 text-center">
            {/* Icon */}
            <div className="w-12 h-12 mx-auto rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Package className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>

            {/* Title */}
            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                {hasSearch ? "Produk tidak ditemukan" : "Belum ada produk"}
            </h3>

            {/* Description */}
            <p className="mt-1.5 text-xs text-gray-400 max-w-sm mx-auto">
                {hasSearch
                    ? "Coba gunakan kata kunci pencarian yang berbeda."
                    : "Belum ada produk di katalog. Tambahkan produk pertama untuk mulai mengelola katalog."}
            </p>

            {/* CTA */}
            {!hasSearch && onCreate && (
                <button
                    type="button"
                    onClick={onCreate}
                    className="mt-5 h-9 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Produk
                </button>
            )}
        </div>
    );
}
