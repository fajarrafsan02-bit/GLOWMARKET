export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const getVisiblePages = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pages.push({ type: "page", value: i });
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                pages.push({ type: "ellipsis", value: i });
            }
        }
        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex items-center justify-center gap-2">
            {/* Prev */}
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-10 px-4 rounded-xl border border-gray-200 text-[13px] font-bold text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
                ← Sebelumnya
            </button>

            {/* Pages */}
            <div className="flex items-center gap-1.5">
                {visiblePages.map((item, idx) =>
                    item.type === "ellipsis" ? (
                        <span
                            key={`ellipsis-${idx}`}
                            className="w-10 h-10 flex items-center justify-center text-[13px] text-gray-300 font-bold"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={item.value}
                            onClick={() => onPageChange(item.value)}
                            className={`w-10 h-10 rounded-xl text-[13px] font-bold transition-all duration-200 ${currentPage === item.value ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200"}`}
                        >
                            {item.value}
                        </button>
                    ),
                )}
            </div>

            {/* Next */}
            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-10 px-4 rounded-xl border border-gray-200 text-[13px] font-bold text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
                Selanjutnya →
            </button>
        </div>
    );
}
