export default function PaymentSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={index}
                    className="h-36 bg-gray-100 dark:bg-gray-800 animate-pulse border border-gray-200 dark:border-gray-700"
                />
            ))}
        </div>
    );
}
