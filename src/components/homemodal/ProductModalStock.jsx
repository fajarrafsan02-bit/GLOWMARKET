export default function ProductModalStock({ displayStock, isAvailable }) {
    return (
        <div className="mt-2.5 sm:mt-4 flex items-center gap-2">
            <span
                className={`w-2 h-2 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-gray-400"}`}
            />

            <span
                className={`text-xs font-medium ${
                    isAvailable
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-gray-500"
                }`}
            >
                {isAvailable ? `${displayStock} item tersedia` : "Stok habis"}
            </span>
        </div>
    );
}
