/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";

export default function OrderReviewModal({
    showReviewModal,
    closeReviewModal,
    selectedProduct,
    selectedOrder,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    reviewError,
    reviewLoading,
    submitReview,
}) {
    if (!showReviewModal) return null;

    const ratingText = {
        1: "Sangat Buruk",
        2: "Buruk",
        3: "Cukup",
        4: "Baik",
        5: "Sangat Baik",
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeReviewModal}
                className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.98 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                Beri Ulasan
                            </h2>

                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Bagikan pengalaman Anda
                            </p>
                        </div>

                        <button
                            onClick={closeReviewModal}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="p-5">
                        {/* Product */}
                        <div className="flex gap-3 mb-6">
                            <div className="w-16 h-16 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                                {selectedProduct?.gambarProduk ? (
                                    <img
                                        src={selectedProduct.gambarProduk}
                                        alt={selectedProduct.namaProduk}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        ✦
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {selectedProduct?.namaProduk}
                                </p>

                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Pesanan #{selectedOrder?.id || selectedOrder?.orderId}
                                </p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="mb-5">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                Rating Produk
                            </p>

                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewRating(star)}
                                        className="hover:scale-110 transition-transform"
                                    >
                                        <Star
                                            className={` w-8 h-8 ${star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"} `}
                                        />
                                    </button>
                                ))}
                            </div>

                            {reviewRating > 0 && (
                                <p className="text-xs text-amber-600 mt-2 font-medium">
                                    {ratingText[reviewRating]}
                                </p>
                            )}
                        </div>

                        {/* Comment */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    Ulasan
                                </label>

                                <span className="text-[11px] text-gray-400">
                                    {reviewComment.length}/500
                                </span>
                            </div>

                            <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value.slice(0, 500))}
                                placeholder="Bagaimana kualitas produk yang Anda terima?"
                                rows={5}
                                className="w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 resize-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            />
                        </div>

                        {reviewError && (
                            <div className="mt-3 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs">
                                {reviewError}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-2 mt-5">
                            <button
                                onClick={closeReviewModal}
                                disabled={reviewLoading}
                                className="flex-1 h-10 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                Batal
                            </button>

                            <button
                                onClick={submitReview}
                                disabled={
                                    reviewLoading || reviewRating === 0 || !reviewComment.trim()
                                }
                                className="flex-1 h-10 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {reviewLoading ? "Mengirim..." : "Kirim Ulasan"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
