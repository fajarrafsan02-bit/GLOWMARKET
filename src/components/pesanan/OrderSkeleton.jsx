function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 animate-pulse">
            <div className="flex justify-between gap-4">
                <div className="space-y-2 w-48">
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-20" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-36" />
                </div>

                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-24" />
            </div>

            <div className="mt-5 flex gap-4">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-lg" />

                <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                </div>
            </div>
        </div>
    );
}

export default function OrderSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}
