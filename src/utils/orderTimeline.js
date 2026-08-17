import { Package, Truck, CheckCircle, Clock } from "lucide-react";

export const ORDER_STEPS = [
    { label: "Pembayaran", icon: Clock, color: "amber" },
    { label: "Diproses", icon: Package, color: "blue" },
    { label: "Dikirim", icon: Truck, color: "purple" },
    { label: "Selesai", icon: CheckCircle, color: "green" },
];

/**
 * Mengembalikan indeks langkah timeline (1 - 4) berdasarkan status pesanan
 * 1 = Pembayaran (Menunggu Pembayaran)
 * 2 = Pesanan Diproses / Dikemas
 * 3 = Pesanan Dikirim
 * 4 = Pesanan Selesai
 */
export function getStatusStep(status) {
    const s = String(status || "").toUpperCase();

    if (["COMPLETED", "DELIVERED", "SELESAI"].includes(s)) return 4;
    if (["SHIPPED", "DIKIRIM", "KIRIM"].includes(s)) return 3;
    if (
        [
            "PAID",
            "SETTLED",
            "PROCESSING",
            "PACKED",
            "DIKEMAS",
            "DIPROSES",
            "MENUNGGU_KONFIRMASI",
        ].includes(s)
    )
        return 2;
    if (["PENDING", "UNPAID", "CREATED", "DIBUAT"].includes(s)) return 1;

    return 1;
}
