import { ShoppingBag } from "lucide-react";

import { formatPrice } from "../../../utils/format.js";

export default function CustomerStats({ totalOrders, totalSpent }) {
    return (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="p-2.5 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <ShoppingBag className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </div>

                    <span className="text-[9px] uppercase tracking-wider text-gray-400">
                        Pesanan
                    </span>
                </div>

                <p className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {totalOrders}
                </p>
            </div>

            <div className="p-2.5 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                            Rp
                        </span>
                    </div>

                    <span className="text-[9px] uppercase tracking-wider text-gray-400">
                        Total Belanja
                    </span>
                </div>

                <p className="mt-1.5 sm:mt-2 text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                    {formatPrice(totalSpent)}
                </p>
            </div>
        </div>
    );
}
