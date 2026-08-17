import { Bell, CheckCheck, Star } from "lucide-react";

export default function HeaderNotifications({
    notificationRef,
    showNotifications,
    setShowNotifications,
    isLoggedIn,
    notificationCount,
    notifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    fetchNotifications,
    handleAuthShow,
    navigate,
}) {
    return (
        <div className="hidden xs:block relative" ref={notificationRef}>
            <button
                onClick={() => {
                    if (isLoggedIn) {
                        setShowNotifications(!showNotifications);
                        if (!showNotifications) fetchNotifications();
                    } else {
                        handleAuthShow(true);
                    }
                }}
                className={`relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition-colors ${showNotifications ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {isLoggedIn && notificationCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showNotifications && isLoggedIn && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[70vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Notifikasi
                        </h3>
                        {notificationCount > 0 && (
                            <button
                                onClick={markAllNotificationsAsRead}
                                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Tandai dibaca
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                                    <Bell className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    Tidak ada notifikasi
                                </p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => {
                                        if (!notif.isRead) markNotificationAsRead(notif.id);
                                        if (notif.paymentId) navigate(`/pesanan`);
                                        setShowNotifications(false);
                                    }}
                                    className={`px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-750 ${!notif.isRead ? "bg-amber-50/50 dark:bg-amber-900/10" : ""}`}
                                >
                                    <div className="flex items-start gap-3">
                                        {notif.type === "ORDER_REVIEW_REQUEST" ? (
                                            <span
                                                className={`mt-0.5 w-7 h-7 shrink-0 rounded-full flex items-center justify-center ${!notif.isRead ? "bg-amber-100 dark:bg-amber-900/30 text-amber-500" : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"}`}
                                            >
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                            </span>
                                        ) : (
                                            <span
                                                className={`mt-2 w-2 h-2 rounded-full shrink-0 ${!notif.isRead ? "bg-amber-500" : "bg-gray-200 dark:bg-gray-600"}`}
                                            />
                                        )}
                                        <div className="flex-1 min-w-0 space-y-0.5">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {notif.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                                {notif.message}
                                            </p>
                                            <p className="text-[11px] text-gray-400 dark:text-gray-500 pt-0.5">
                                                {new Date(notif.timestamp).toLocaleString("id-ID", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
