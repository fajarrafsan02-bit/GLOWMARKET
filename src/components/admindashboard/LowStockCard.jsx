import { AlertTriangle, CheckCircle2, Package, ChevronRight } from "lucide-react";

export default function LowStockCard({ products = [] }) {
    const lowStockProducts = products
        .filter((product) => Number(product.stock ?? product.stok ?? 999) <= 5)
        .slice(0, 4);

    return (
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />

                <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Stok Menipis
                    </h2>

                    <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-400">Produk yang perlu diperiksa</p>
                </div>
            </div>

            {lowStockProducts.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                    <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 mx-auto text-emerald-500" />

                    <p className="mt-2 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                        Tidak ada stok kritis
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {lowStockProducts.map((product, index) => (
                        <div
                            key={product.id ?? index}
                            className="px-3 sm:px-4 py-3 flex items-center gap-2.5 sm:gap-3"
                        >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                {product.gambar ? (
                                    <img
                                        src={product.gambar}
                                        alt={product.nama}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 m-2 sm:m-3 text-gray-400" />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] sm:text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                                    {product.nama}
                                </p>

                                <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-500">
                                    Stok {product.stock ?? product.stok ?? 0} pcs
                                </p>
                            </div>

                            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300" />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
