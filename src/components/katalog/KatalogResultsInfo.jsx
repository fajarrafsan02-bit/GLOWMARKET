export default function KatalogResultsInfo({
    shown,
    total,
    currentPage,
    totalPages,
    selectedCategory,
    selectedKarat,
}) {
    if (total === 0) {
        return null;
    }

    return (
        <div className="flex items-center justify-between mb-8 mt-12 px-1">
            <p className="text-[13px] text-gray-500 font-light">
                Menampilkan <span className="font-bold text-gray-800">{shown}</span> dari{" "}
                <span className="font-bold text-gray-800">{total}</span> produk
                {selectedCategory !== "Semua" && (
                    <span className="ml-2 text-gray-400">• {selectedCategory}</span>
                )}
                {selectedKarat !== "Semua" && (
                    <span className="ml-2 text-gray-400">• {selectedKarat}</span>
                )}
            </p>

            {totalPages > 1 && (
                <p className="text-[13px] text-gray-500 font-light">
                    Halaman <span className="font-bold text-gray-800">{currentPage}</span> /{" "}
                    {totalPages}
                </p>
            )}
        </div>
    );
}
