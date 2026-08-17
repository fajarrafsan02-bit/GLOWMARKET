import { MapPin, Plus } from "lucide-react";

export default function AddressHeader({ onAdd }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Alamat Saya
                    </h2>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Kelola alamat pengiriman untuk pesanan Anda
                </p>
            </div>

            <button
                type="button"
                onClick={onAdd}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition shadow-sm"
            >
                <Plus className="w-4 h-4" />
                Tambah Alamat
            </button>
        </div>
    );
}
