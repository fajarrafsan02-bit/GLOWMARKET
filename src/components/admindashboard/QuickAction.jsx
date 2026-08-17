export default function QuickAction({ icon: ActionIcon, label, description }) {
    return (
        <button
            type="button"
            className="p-3 sm:p-5 bg-white dark:bg-gray-900 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {ActionIcon && <ActionIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />}
            </div>

            <p className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs font-semibold text-gray-900 dark:text-white">{label}</p>

            <p className="mt-0.5 text-[9px] sm:text-[10px] leading-3 sm:leading-4 text-gray-400">{description}</p>
        </button>
    );
}
