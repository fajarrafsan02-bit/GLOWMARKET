import { Package, X } from "lucide-react";

export default function ProductFormHeader({ isEdit, loading, onClose }) {
    return (
        <div className="shrink-0 px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2 sm:gap-3">
            <div>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                        <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                    </div>

                    <h2 className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {isEdit ? "Edit Produk" : "Tambah Produk"}
                    </h2>
                </div>

                <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] text-gray-400 ml-9 sm:ml-10">
                    {isEdit ? "Perbarui informasi produk" : "Tambahkan produk baru ke katalog"}
                </p>
            </div>

            <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition"
                aria-label="Tutup"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
