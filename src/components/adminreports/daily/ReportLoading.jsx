export default function ReportLoading() {
    return (
        <div className="p-8">
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
                    />
                ))}
            </div>
        </div>
    );
}
