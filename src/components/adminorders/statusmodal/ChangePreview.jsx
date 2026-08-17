import { motion as Motion } from "framer-motion";

import { orderStatusLabel } from "../../../utils/orderStatus.js";

export default function ChangePreview({ currentStatus, tempStatus, meta }) {
    return (
        <Motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-900/10"
        >
            <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                Perubahan status
            </p>

            <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                    {orderStatusLabel(currentStatus)}
                </span>

                <span className="text-gray-400">→</span>

                <span className={` px-2 py-1 rounded ${meta.bg} ${meta.color} font-medium `}>
                    {orderStatusLabel(tempStatus)}
                </span>
            </div>
        </Motion.div>
    );
}
