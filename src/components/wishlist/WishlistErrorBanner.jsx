export default function WishlistErrorBanner({ error, onRetry }) {
    return (
        <div className="mb-5 p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-sm text-red-700 dark:text-red-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>{error}</span>

            <button
                type="button"
                onClick={onRetry}
                className="text-xs font-semibold underline"
            >
                Coba Lagi
            </button>
        </div>
    );
}
