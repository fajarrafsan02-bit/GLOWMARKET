import { Truck } from "lucide-react";

export default function CourierInfo({ order }) {
    return (
        <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">
                Kurir Pengiriman
            </p>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    <Truck className="w-4 h-4 text-gray-500" />
                </div>

                <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase">
                        {order.ongkirKurir} {order.ongkirLayanan && `- ${order.ongkirLayanan}`}
                    </p>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                        Rp {order.ongkir?.toLocaleString("id-ID")}
                    </p>
                </div>
            </div>
        </div>
    );
}
