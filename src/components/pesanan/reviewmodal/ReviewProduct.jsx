export default function ReviewProduct({ product, order }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                {product?.gambarProduk ? (
                    <img
                        src={product.gambarProduk}
                        alt={product.namaProduk}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300 dark:text-gray-500">
                        ✦
                    </div>
                )}
            </div>

            <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {product?.namaProduk || "Produk"}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Pesanan #{order?.id || order?.orderId || "-"}
                </p>
            </div>
        </div>
    );
}
