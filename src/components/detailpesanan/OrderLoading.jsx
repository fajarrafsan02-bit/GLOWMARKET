export default function OrderLoading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 dark:border-amber-500 border-t-transparent mx-auto" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat detail pesanan...</p>
            </div>
        </div>
    );
}
