export default function CartSkeleton() {
    return (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_350px] gap-5">
            <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="h-32 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse"
                    />
                ))}
            </div>

            <div className="h-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse" />
        </div>
    );
}
