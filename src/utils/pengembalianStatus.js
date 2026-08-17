import { Clock, CheckCircle, XCircle, PackageCheck } from "lucide-react";

export const STATUS_META = {
    DIAJUKAN: {
        label: "Menunggu Persetujuan",
        cls: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
        icon: Clock,
    },
    DISETUJUI: {
        label: "Disetujui",
        cls: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
        icon: CheckCircle,
    },
    DITOLAK: {
        label: "Ditolak",
        cls: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
        icon: XCircle,
    },
    DITERIMA: {
        label: "Barang Diterima",
        cls: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
        icon: PackageCheck,
    },
};
