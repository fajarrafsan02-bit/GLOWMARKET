import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OrdersPagination({
    startIndex,
    endIndex,
    total,
    currentPage,
    totalPages,
    onPageChange,
}) {
    if (totalPages <= 1) {
        return null;
    }

    const visiblePages = [];

    if (totalPages <= 5) {
        for (let page = 1; page <= totalPages; page++) {
            visiblePages.push(page);
        }
    } else if (currentPage <= 3) {
        visiblePages.push(1, 2, 3, 4, 5);
    } else if (currentPage >= totalPages - 2) {
        visiblePages.push(
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        );
    } else {
        visiblePages.push(
            currentPage - 2,
            currentPage - 1,
            currentPage,
            currentPage + 1,
            currentPage + 2,
        );
    }

    const firstItem = total === 0 ? 0 : startIndex + 1;

    const lastItem = Math.min(endIndex, total);

    return (
        <div className="mt-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Result Info */}
                <p className="text-[11px] text-gray-400 text-center sm:text-left order-2 sm:order-1">
                    Menampilkan{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                        {firstItem}
                    </span>{" "}
                    -{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">{lastItem}</span>{" "}
                    dari{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">{total}</span>{" "}
                    pesanan
                </p>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-1 order-1 sm:order-2">
                    {/* Previous */}
                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-35 disabled:cursor-not-allowed transition"
                        aria-label="Halaman sebelumnya"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Pages */}
                    <div className="flex items-center gap-1">
                        {totalPages > 5 && currentPage > 3 && (
                            <button
                                type="button"
                                onClick={() => onPageChange(1)}
                                className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg text-[11px] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                1
                            </button>
                        )}

                        {totalPages > 5 && currentPage > 3 && (
                            <span className="hidden sm:flex w-5 items-center justify-center text-xs text-gray-400">
                                …
                            </span>
                        )}

                        {visiblePages.map((page) => {
                            const active = page === currentPage;

                            return (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => onPageChange(page)}
                                    className={` w-8 h-8 rounded-lg text-[11px] font-medium transition ${active ? ` bg-amber-500 text-white shadow-sm ` : ` text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 `} `}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <span className="hidden sm:flex w-5 items-center justify-center text-xs text-gray-400">
                                …
                            </span>
                        )}

                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <button
                                type="button"
                                onClick={() => onPageChange(totalPages)}
                                className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg text-[11px] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                {totalPages}
                            </button>
                        )}
                    </div>

                    {/* Next */}
                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-35 disabled:cursor-not-allowed transition"
                        aria-label="Halaman selanjutnya"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
