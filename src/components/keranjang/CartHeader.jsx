import { Link } from "react-router-dom";

export default function CartHeader({ loading, items, totalQuantity, onClearCart }) {
    const hasItems = !loading && items.length > 0;

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        Keranjang
                    </h1>

                    {hasItems && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {totalQuantity} item{totalQuantity !== 1 ? "s" : ""} dalam keranjang
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {hasItems && (
                        <button
                            type="button"
                            onClick={onClearCart}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                        >
                            Kosongkan
                        </button>
                    )}

                    <Link
                        to="/katalog"
                        className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition"
                    >
                        ← Lanjut Belanja
                    </Link>
                </div>
            </div>

            <Link
                to="/katalog"
                className="sm:hidden inline-flex mt-3 items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400"
            >
                ← Lanjut Belanja
            </Link>
        </div>
    );
}
