import { orderStatusLabel } from "../../../utils/orderStatus.js";

export default function StatusSelect({ tempStatus, onTempStatusChange, statuses, meta }) {
    const SelectedIcon = meta.icon;

    return (
        <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">
                Status baru
            </label>

            <div className="relative">
                <select
                    value={tempStatus}
                    onChange={(event) => onTempStatusChange(event.target.value)}
                    className="w-full h-11 pl-3 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 appearance-none cursor-pointer"
                >
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {orderStatusLabel(status)}
                        </option>
                    ))}
                </select>

                <SelectedIcon
                    className={` pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${meta.color} `}
                />
            </div>
        </div>
    );
}
