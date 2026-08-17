export default function VoucherStatusBadge({ v }) {
    const now = new Date();

    if (!v.aktif) {
        return (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Nonaktif
            </span>
        );
    }

    if (v.berlakuSampai && new Date(v.berlakuSampai) < now) {
        return (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                Kedaluwarsa
            </span>
        );
    }

    return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
            Aktif
        </span>
    );
}
