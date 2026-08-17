export default function OrderSkeletonList() {
    return (
        <>
            {Array.from({
                length: 6,
            }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 animate-pulse"
                >
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-24" />
                        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-20 ml-auto" />
                    </div>
                </div>
            ))}
        </>
    );
}
