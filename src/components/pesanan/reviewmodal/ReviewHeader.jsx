import { X } from "lucide-react";

export default function ReviewHeader({ onClose, disabled }) {
    return (
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-100 dark:border-gray-800">
            <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Beri Penilaian</h2>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Bagikan pengalaman belanja Anda
                </p>
            </div>

            <button
                type="button"
                onClick={onClose}
                disabled={disabled}
                aria-label="Tutup"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
