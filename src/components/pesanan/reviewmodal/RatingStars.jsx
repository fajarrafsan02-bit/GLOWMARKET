import { AnimatePresence, motion as Motion } from "framer-motion";

import { Star } from "lucide-react";

const ratingLabels = {
    1: "Sangat Buruk",
    2: "Buruk",
    3: "Cukup",
    4: "Baik",
    5: "Sangat Baik",
};

export default function RatingStars({ rating, onRatingChange, disabled }) {
    return (
        <div className="text-center py-2">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Bagaimana kualitas produk ini?
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Ketuk bintang untuk memberikan penilaian
            </p>

            <div className="flex justify-center items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= rating;

                    return (
                        <Motion.button
                            key={star}
                            type="button"
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => onRatingChange(star)}
                            disabled={disabled}
                            aria-label={`Rating ${star}`}
                            className="p-1 rounded-lg transition disabled:cursor-not-allowed"
                        >
                            <Star
                                className={` w-8 h-8 sm:w-9 sm:h-9 transition-colors duration-150 ${active ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"} `}
                            />
                        </Motion.button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                {rating > 0 && (
                    <Motion.div
                        key={rating}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-3 text-sm font-medium text-amber-600 dark:text-amber-400"
                    >
                        {ratingLabels[rating]}
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
