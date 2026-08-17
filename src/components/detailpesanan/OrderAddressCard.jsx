import { MapPin } from "lucide-react";

export default function OrderAddressCard({ recipientName, phone, fullAddress, order }) {
    return (
        <section className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-sm">
            <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />

                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Alamat Pengiriman
                    </h2>
                </div>
            </div>

            <div className="px-4 sm:px-5 py-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {recipientName || "-"}
                </p>

                {phone && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {phone}
                    </p>
                )}

                <p className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-300">
                    {fullAddress || "Alamat tidak tersedia"}
                </p>

                {order.resi && (
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400">
                            Nomor Resi
                        </p>

                        <p className="mt-1 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 select-all">
                            {order.resi}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
