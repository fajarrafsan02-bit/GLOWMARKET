import { MessageSquare, Star } from "lucide-react";

export default function ProductModalReviews({ reviews, onSeeAll }) {
    return (
        <div className="mt-3 sm:mt-5">
            <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-white">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    Customer Reviews
                </h3>

                {reviews.length > 0 && (
                    <button
                        type="button"
                        onClick={onSeeAll}
                        className="text-[9px] sm:text-[10px] uppercase tracking-[0.1em] text-gray-400 hover:text-amber-600 transition-colors"
                    >
                        Lihat Semua
                    </button>
                )}
            </div>

            {reviews.length > 0 ? (
                <div className="space-y-2">
                    {reviews.slice(0, 2).map((review) => (
                        <div key={review.id} className="p-2.5 sm:p-3.5 border border-gray-200 dark:border-gray-800 rounded-lg">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-[9px] font-bold text-white dark:text-gray-900">
                                        {review.userName
                                            ? review.userName.charAt(0).toUpperCase()
                                            : "U"}
                                    </div>

                                    <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                        {review.userName || "Customer"}
                                    </span>
                                </div>

                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3 h-3 ${
                                                i < review.rating
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-gray-200 dark:text-gray-700"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="mt-1.5 text-xs leading-4 text-gray-500 dark:text-gray-400">
                                {review.komentar}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-3 px-3 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg text-center">
                    <MessageSquare className="w-4 h-4 mx-auto mb-1 text-gray-300" />

                    <p className="text-[11px] text-gray-400">Belum ada ulasan untuk produk ini.</p>
                </div>
            )}
        </div>
    );
}
