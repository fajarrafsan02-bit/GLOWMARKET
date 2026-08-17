import { FileQuestion } from "lucide-react";

export default function ReturnEmpty() {
    return (
        <div className="py-16 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <FileQuestion className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600" />

            <p className="mt-3 text-sm text-gray-400">Belum ada pengajuan pengembalian</p>
        </div>
    );
}
