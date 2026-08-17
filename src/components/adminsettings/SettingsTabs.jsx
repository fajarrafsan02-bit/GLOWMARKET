/**
 * Navigasi tab horizontal untuk halaman Pengaturan.
 *
 * Logic dan contract props TIDAK DIUBAH.
 */
export default function SettingsTabs({ tabs, activeTab, onChange }) {
    return (
        <div className="mb-4 sm:mb-5 relative w-full">
            <div className="overflow-x-auto hide-scrollbar pb-1 -mx-3 px-3 sm:mx-0 sm:px-0">
                <div className="inline-flex min-w-max items-center gap-1 p-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = tab.key === activeTab;

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => onChange(tab.key)}
                            className={` relative h-8 sm:h-10 px-3 sm:px-4 shrink-0 rounded-lg text-[10px] sm:text-[11px] font-semibold inline-flex items-center justify-center gap-1.5 transition-all duration-200 whitespace-nowrap ${isActive ? ` bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 shadow-sm ` : ` text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/70 dark:hover:bg-gray-800/70 `} `}
                        >
                            <Icon
                                className={` w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors ${isActive ? ` text-amber-500 dark:text-amber-400 ` : ` text-gray-400 dark:text-gray-500 `} `}
                            />

                            <span>{tab.label}</span>

                            {/* Active indicator */}
                            {isActive && (
                                <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-5 h-0.5 rounded-full bg-amber-500" />
                            )}
                        </button>
                    );
                })}
                </div>
            </div>
        </div>
    );
}
