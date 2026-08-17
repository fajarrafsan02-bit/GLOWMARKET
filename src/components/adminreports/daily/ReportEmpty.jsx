import { CalendarDays } from "lucide-react";

export default function ReportEmpty() {
    return (
        <div className="py-14 text-center">
            <div className="w-10 h-10 mx-auto rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                <CalendarDays className="w-5 h-5 text-gray-400" />
            </div>

            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tidak Ada Data Laporan
            </p>

            <p className="mt-1 text-xs text-gray-400">
                Pilih rentang tanggal lain untuk menampilkan transaksi
            </p>
        </div>
    );
}
