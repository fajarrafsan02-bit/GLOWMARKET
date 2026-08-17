import { Clock3, Package, Truck, CheckCircle2, ChevronRight, RotateCcw } from "lucide-react";

export default function OrderStatusCard({ orderStatusCounts }) {
    const counts = orderStatusCounts || {
        pending: 0,
        processing: 0,
        shipped: 0,
        completed: 0,
        returned: 0,
    };

    const statuses = [
        {
            label: "Menunggu pembayaran",
            count: counts.pending,
            icon: Clock3,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            label: "Diproses",
            count: counts.processing,
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Dikirim",
            count: counts.shipped,
            icon: Truck,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
        },
        {
            label: "Selesai",
            count: counts.completed,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Dikembalikan",
            count: counts.returned,
            icon: RotateCcw,
            color: "text-rose-600",
            bg: "bg-rose-50",
        },
    ];

    return (
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Status Pesanan
                </h2>

                <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-400">
                    Pesanan yang membutuhkan perhatian
                </p>
            </div>

            <div className="p-2 sm:p-3">
                {statuses.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.label}
                            type="button"
                            className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
                        >
                            <div
                                className={` w-8 h-8 rounded-lg flex items-center justify-center ${item.bg} `}
                            >
                                <Icon className={` w-4 h-4 ${item.color} `} />
                            </div>

                            <span className="flex-1 text-xs text-gray-600 dark:text-gray-300">
                                {item.label}
                            </span>

                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {item.count}
                            </span>

                            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
