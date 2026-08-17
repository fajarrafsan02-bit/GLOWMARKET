import { Search, MessageCircle } from "lucide-react";

export default function ChatSidebar({
    searchQuery,
    setSearchQuery,
    filteredCustomers,
    selectedCustomer,
    setSelectedCustomer,
    formatTime,
}) {
    return (
        <aside className="w-full h-full bg-white dark:bg-gray-900 flex flex-col">
            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Percakapan
                        </h2>

                        <p className="text-[10px] text-gray-400 mt-0.5">Pesan dari pelanggan</p>
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                        <MessageCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari pelanggan..."
                        className="w-full h-9 pl-9 pr-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition"
                    />
                </div>
            </div>

            {/* =====================================================
                CUSTOMER LIST
            ====================================================== */}

            <div className="flex-1 overflow-y-auto">
                {filteredCustomers.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center px-6 text-center">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>

                        <p className="mt-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                            Tidak ada pelanggan
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                            Coba gunakan kata kunci lain.
                        </p>
                    </div>
                ) : (
                    <div>
                        {filteredCustomers.map((customer) => {
                            const isSelected = selectedCustomer?.userId === customer.userId;

                            const unreadCount = Number(customer.unreadCount || 0);

                            const customerName = customer.userName || "Pelanggan";

                            const lastMessage = customer.lastMessage || "Belum ada pesan";

                            return (
                                <button
                                    key={customer.userId}
                                    type="button"
                                    onClick={() => setSelectedCustomer(customer)}
                                    className={` relative w-full px-4 py-3 flex items-center gap-3 text-left border-b border-gray-100 dark:border-gray-800 transition ${isSelected ? ` bg-amber-50 dark:bg-amber-900/15 ` : ` hover:bg-gray-50 dark:hover:bg-gray-800/70 `} `}
                                >
                                    {/* Active indicator */}
                                    {isSelected && (
                                        <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500" />
                                    )}

                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div
                                            className={` w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold ${isSelected ? ` bg-amber-500 text-white ` : ` bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 `} `}
                                        >
                                            {customerName.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Online */}
                                        {customer.isOnline && (
                                            <span className="absolute right-[-1px] bottom-[-1px] w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
                                        )}
                                    </div>

                                    {/* Message info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p
                                                className={` text-xs truncate ${unreadCount > 0 ? "font-semibold text-gray-900 dark:text-white" : "font-medium text-gray-800 dark:text-gray-200"} `}
                                            >
                                                {customerName}
                                            </p>

                                            {customer.lastMessageTime && (
                                                <span className="shrink-0 text-[9px] text-gray-400">
                                                    {formatTime(customer.lastMessageTime)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-1 flex items-center gap-2">
                                            <p
                                                className={` flex-1 min-w-0 truncate text-[10px] ${unreadCount > 0 ? "text-gray-700 dark:text-gray-300 font-medium" : "text-gray-400 dark:text-gray-500"} `}
                                            >
                                                {lastMessage}
                                            </p>

                                            {unreadCount > 0 && (
                                                <span className="shrink-0 min-w-[17px] h-[17px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                                                    {unreadCount > 99 ? "99+" : unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </aside>
    );
}
