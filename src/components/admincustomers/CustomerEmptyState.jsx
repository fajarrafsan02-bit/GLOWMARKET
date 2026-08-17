import { Users } from "lucide-react";

export default function CustomerEmptyState({ hasSearch }) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl py-14 px-5 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-400" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                {hasSearch ? "Pelanggan tidak ditemukan" : "Belum ada pelanggan"}
            </h3>

            <p className="mt-1.5 text-xs text-gray-400">
                {hasSearch
                    ? "Coba gunakan kata kunci pencarian yang berbeda."
                    : "Data pelanggan akan muncul di sini setelah pengguna terdaftar."}
            </p>
        </div>
    );
}
