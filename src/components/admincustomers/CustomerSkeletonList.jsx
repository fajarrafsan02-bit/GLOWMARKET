export default function CustomerSkeletonList() {
    return (
        <div className="space-y-2">
            {Array.from({
                length: 6,
            }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-4 animate-pulse"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800" />

                        <div className="flex-1">
                            <div className="h-3.5 rounded bg-gray-200 dark:bg-gray-800 w-40" />

                            <div className="h-2.5 rounded bg-gray-200 dark:bg-gray-800 w-56 mt-2" />
                        </div>

                        <div className="h-8 w-20 rounded-lg bg-gray-200 dark:bg-gray-800" />
                    </div>
                </div>
            ))}
        </div>
    );
}
