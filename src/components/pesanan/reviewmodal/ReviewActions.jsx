export default function ReviewActions({ onClose, onSubmit, loading, disabled }) {
    return (
        <div className="flex gap-2.5 pt-1">
            <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Batal
            </button>

            <button
                type="button"
                onClick={onSubmit}
                disabled={disabled}
                className="flex-[1.5] h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold shadow-sm shadow-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-500"
            >
                {loading ? (
                    <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        Mengirim...
                    </span>
                ) : (
                    "Kirim Ulasan"
                )}
            </button>
        </div>
    );
}
