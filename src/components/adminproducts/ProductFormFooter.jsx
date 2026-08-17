import { Save } from "lucide-react";

export default function ProductFormFooter({ isEdit, loading, uploading, onClose }) {
    return (
        <div className="sticky bottom-0 px-4 sm:px-5 py-2 sm:py-3 border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur flex gap-2">
            <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 h-9 sm:h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[11px] sm:text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition"
            >
                Batal
            </button>

            <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 h-9 sm:h-10 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white disabled:text-gray-500 text-[11px] sm:text-xs font-semibold inline-flex items-center justify-center gap-1.5 sm:gap-2 transition disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        Menyimpan...
                    </>
                ) : (
                    <>
                        <Save className="w-3.5 h-3.5" />
                        {isEdit ? "Simpan Perubahan" : "Tambah Produk"}
                    </>
                )}
            </button>
        </div>
    );
}
