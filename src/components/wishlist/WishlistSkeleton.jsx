export default function WishlistSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    key={index}
                    className="overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse"
                >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800" />

                    <div className="p-3 space-y-2">
                        <div className="h-3 w-4/5 rounded bg-gray-100 dark:bg-gray-800" />

                        <div className="h-3 w-2/5 rounded bg-gray-100 dark:bg-gray-800" />

                        <div className="h-9 w-full rounded bg-gray-100 dark:bg-gray-800" />
                    </div>
                </div>
            ))}
        </div>
    );
}
