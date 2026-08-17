import { Check, Truck, Package, Clock3 } from "lucide-react";

export default function OrderStatusBadge({ status }) {
    const kode = String(status || "").toUpperCase();

    let info;

    if (["COMPLETED", "DELIVERED", "SELESAI"].includes(kode)) {
        info = {
            label: "Pesanan Selesai",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            icon: Check,
        };
    } else if (["SHIPPED", "DIKIRIM"].includes(kode)) {
        info = {
            label: "Pesanan Dikirim",
            color: "text-blue-600",
            bg: "bg-blue-50",
            icon: Truck,
        };
    } else if (["PROCESSING", "PAID", "SETTLED", "DIKEMAS", "DIPROSES", "PACKED"].includes(kode)) {
        info = {
            label: "Pesanan Diproses",
            color: "text-amber-600",
            bg: "bg-amber-50",
            icon: Package,
        };
    } else if (["PENDING", "UNPAID", "DIBUAT", "CREATED"].includes(kode)) {
        info = {
            label: "Menunggu Pembayaran",
            color: "text-amber-600",
            bg: "bg-amber-50",
            icon: Clock3,
        };
    } else {
        info = {
            label: status || "Pesanan",
            color: "text-gray-600",
            bg: "bg-gray-100",
            icon: Package,
        };
    }

    const StatusIcon = info.icon;

    return (
        <div
            className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full self-start sm:self-auto ${info.bg} ${info.color}`}
        >
            <StatusIcon className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">{info.label}</span>
        </div>
    );
}
