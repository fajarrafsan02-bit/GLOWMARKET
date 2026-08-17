import { orderStatusLabel } from "../../../utils/orderStatus.js";

export default function CurrentStatus({ currentStatus, meta }) {
    const CurrentIcon = meta.icon;

    return (
        <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">
                Status saat ini
            </p>

            <div className={` flex items-center gap-3 p-3 rounded-lg ${meta.bg} `}>
                <div className="w-8 h-8 shrink-0 rounded-lg bg-white/70 dark:bg-gray-900/40 flex items-center justify-center">
                    <CurrentIcon className={` w-4 h-4 ${meta.color} `} />
                </div>

                <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {orderStatusLabel(currentStatus)}
                    </p>

                    <p className="mt-0.5 text-[10px] text-gray-400">Status pesanan saat ini</p>
                </div>
            </div>
        </div>
    );
}
