import { useState } from "react";
import { ChevronRight, Copy } from "lucide-react";

import OrderStatusBadge from "./OrderStatusBadge.jsx";
import OrderTimeline from "./OrderTimeline.jsx";

export default function OrderHeader({ orderId, createdAt, status, currentStep }) {
    const [copied, setCopied] = useState(false);

    const copyOrderId = async () => {
        try {
            await navigator.clipboard.writeText(String(orderId));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard tidak tersedia.
        }
    };

    return (
        <>
            <div className="mb-3 flex items-center gap-2 text-xs text-gray-400">
                <span>Pesanan Saya</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-600 dark:text-gray-300">Detail Pesanan</span>
            </div>

            <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-sm">
                <div className="px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Pesanan #{orderId}
                                </span>

                                <button
                                    type="button"
                                    onClick={copyOrderId}
                                    className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-amber-600 transition"
                                >
                                    <Copy className="w-3 h-3" />
                                    {copied ? "Tersalin" : "Salin"}
                                </button>
                            </div>

                            <p className="mt-1 text-[11px] text-gray-400">
                                {createdAt ? new Date(createdAt).toLocaleString("id-ID") : "-"}
                            </p>
                        </div>

                        <OrderStatusBadge status={status} />
                    </div>
                </div>

                <OrderTimeline currentStep={currentStep} />
            </section>
        </>
    );
}
