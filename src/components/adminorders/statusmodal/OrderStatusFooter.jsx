export default function OrderStatusFooter({ onClose, onSave, disabled }) {
    return (
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-950/40 flex gap-2 shrink-0">
            <button
                type="button"
                onClick={onClose}
                className="flex-1 h-9 sm:h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[11px] sm:text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
                Batal
            </button>

            <button
                type="button"
                onClick={onSave}
                disabled={disabled}
                className="flex-1 h-9 sm:h-10 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white text-[11px] sm:text-xs font-semibold transition disabled:cursor-not-allowed"
            >
                Simpan Perubahan
            </button>
        </div>
    );
}
