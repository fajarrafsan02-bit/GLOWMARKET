export default function ProfileContentHeader({ activeTabData }) {
    return (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                    <activeTabData.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                </div>

                <div className="min-w-0">
                    <h2 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {activeTabData.label}
                    </h2>

                    <p className="mt-0.5 text-[10px] sm:text-xs text-gray-400 truncate">{activeTabData.description}</p>
                </div>
            </div>
        </div>
    );
}
