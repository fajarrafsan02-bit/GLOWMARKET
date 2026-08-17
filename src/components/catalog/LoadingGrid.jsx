export default function LoadingGrid() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden animate-pulse shadow-sm"
                >
                    <div className="aspect-square bg-gray-50" />
                    <div className="p-5 space-y-4">
                        <div className="h-4 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                        <div className="h-10 bg-gray-100 rounded-xl mt-4" />
                    </div>
                </div>
            ))}
        </div>
    );
}
