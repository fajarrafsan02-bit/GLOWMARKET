import { Star } from "lucide-react";

export default function ProductDetailRating({ rating, reviewCount }) {
    return (
        <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => {
                    const filled = i < Math.floor(rating);

                    const partial = i === Math.floor(rating) && rating % 1 >= 0.5;

                    return (
                        <Star
                            key={i}
                            className={` w-4 h-4 ${filled ? "fill-amber-400 text-amber-400" : partial ? "fill-amber-200 text-amber-400" : "text-gray-200 dark:text-gray-700"} `}
                        />
                    );
                })}
            </div>

            <span className="text-xs text-gray-500 dark:text-gray-400">
                {rating > 0 ? rating.toFixed(1) : "0.0"}
                {" · "}
                {reviewCount} reviews
            </span>
        </div>
    );
}
