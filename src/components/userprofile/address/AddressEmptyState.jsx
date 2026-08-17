import { MapPin, Plus } from "lucide-react";

export default function AddressEmptyState({ onAdd }) {
    return (
        <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl py-12 px-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7 text-amber-500" />
            </div>

            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Belum Ada Alamat</h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-5">
                Tambahkan alamat pengiriman agar proses checkout menjadi lebih cepat.
            </p>

            <button
                type="button"
                onClick={onAdd}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition"
            >
                <Plus className="w-4 h-4" />
                Tambah Alamat
            </button>
        </div>
    );
}
