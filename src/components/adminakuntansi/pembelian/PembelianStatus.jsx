import { CheckCircle2, Clock3, Ban } from "lucide-react";

export function statusPembelian(pembelian) {
    if (pembelian.dibatalkan) {
        return {
            label: "Dibatalkan",
            warnaBg: "bg-gray-100 dark:bg-gray-800",
            warnaText: "text-gray-400 dark:text-gray-500",
            icon: <Ban className="w-3 h-3" />,
        };
    }

    if (pembelian.metode === "KREDIT" && !pembelian.dilunasi) {
        return {
            label: "Belum lunas",
            warnaBg: "bg-amber-50 dark:bg-amber-900/20",
            warnaText: "text-amber-600 dark:text-amber-400",
            icon: <Clock3 className="w-3 h-3" />,
        };
    }

    return {
        label: "Lunas",
        warnaBg: "bg-emerald-50 dark:bg-emerald-900/20",
        warnaText: "text-emerald-600 dark:text-emerald-400",
        icon: <CheckCircle2 className="w-3 h-3" />,
    };
}
