import { Star } from "lucide-react";

export default function ProductModalRating({ avgRating, reviewCount }) {
    return (
        <div className="mt-4 flex items-center gap-3">
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => {
                    const filled = i < Math.floor(avgRating);

                    const partial = i === Math.floor(avgRating) && avgRating % 1 >= 0.5;

                    return (
                        <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                                filled
                                    ? "fill-amber-400 text-amber-400"
                                    : partial
                                      ? "fill-amber-200 text-amber-400"
                                      : "text-gray-200 dark:text-gray-700"
                            }`}
                        />
                    );
                })}
            </div>

            <span className="text-xs text-gray-500 dark:text-gray-400">
                {avgRating > 0
                    ? `${avgRating.toFixed(1)} · ${reviewCount} ulasan`
                    : "Belum ada ulasan"}
            </span>
        </div>
    );
}
