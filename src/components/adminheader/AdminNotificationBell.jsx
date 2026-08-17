import { Bell, X, CheckCheck } from "lucide-react";

import NotificationItem from "./NotificationItem.jsx";

function NotificationListHeader({ notifCount, onMarkAllAsRead, onClose }) {
    return (
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Notifikasi
                    </h3>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                        {notifCount > 0
                            ? `${notifCount} belum dibaca`
                            : "Tidak ada notifikasi baru"}
                    </p>
                </div>

                <div className="flex items-center gap-1">
                    {notifCount > 0 && (
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                onMarkAllAsRead();
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition"
                        >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Tandai dibaca
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        aria-label="Tutup notifikasi"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export function NotificationList({ notifications, onItemClick, formatTime }) {
    if (notifications.length === 0) {
        return (
            <div className="px-6 py-10 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-gray-400" />
                </div>

                <p className="mt-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                    Belum ada notifikasi
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                    Aktivitas penting toko akan muncul di sini.
                </p>
            </div>
        );
    }

    return (
        <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.map((notification, index) => (
                <NotificationItem
                    key={notification.id ?? index}
                    notif={notification}
                    index={index}
                    onClick={onItemClick}
                    formatTime={formatTime}
                />
            ))}
        </div>
    );
}

function NotificationDropdown({
    notifications,
    notifCount,
    onClose,
    onMarkAllAsRead,
    onItemClick,
    formatTime,
}) {
    return (
        <div className="hidden md:block absolute right-0 top-full mt-2 w-[360px] rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <NotificationListHeader
                notifCount={notifCount}
                onMarkAllAsRead={onMarkAllAsRead}
                onClose={onClose}
            />

            <NotificationList
                notifications={notifications}
                onItemClick={onItemClick}
                formatTime={formatTime}
            />
        </div>
    );
}

export default function AdminNotificationBell({
    notifications,
    notifCount,
    showNotifList,
    onToggle,
    onClose,
    onMarkAllAsRead,
    onItemClick,
    formatTime,
    isConnected,
}) {
    return (
        <div className="relative z-50">
            <button
                type="button"
                onClick={onToggle}
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Notifikasi"
                aria-expanded={showNotifList}
            >
                <Bell className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />

                {/* Unread count */}
                {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white dark:border-gray-900">
                        {notifCount > 99 ? "99+" : notifCount}
                    </span>
                )}

                {/* Connection indicator */}
                {isConnected && (
                    <span className="absolute right-0.5 bottom-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
                )}
            </button>

            {showNotifList && (
                <NotificationDropdown
                    notifications={notifications}
                    notifCount={notifCount}
                    onClose={onClose}
                    onMarkAllAsRead={onMarkAllAsRead}
                    onItemClick={onItemClick}
                    formatTime={formatTime}
                />
            )}
        </div>
    );
}
