import { Menu, ChevronDown } from "lucide-react";

import useAdminNotifications from "../hooks/useAdminNotifications.js";

import AdminNotificationBell from "./adminheader/AdminNotificationBell.jsx";
import AdminNotificationPanel from "./adminheader/AdminNotificationPanel.jsx";
import AdminAvatar from "./adminheader/AdminAvatar.jsx";

export default function AdminHeader({ title, adminName, onToggleSidebar }) {
    const notif = useAdminNotifications();

    return (
        <>
            <header className="sticky top-0 z-40 h-14 sm:h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
                <div className="h-full px-3 sm:px-5 lg:px-6 flex items-center justify-between gap-2 sm:gap-4">
                    {/* =================================================
                        LEFT
                    ================================================== */}

                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        {/* Mobile Sidebar */}
                        <button
                            type="button"
                            onClick={onToggleSidebar}
                            className="md:hidden w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            aria-label="Buka menu"
                        >
                            <Menu className="w-4 h-4" />
                        </button>

                        {/* Title */}
                        <div className="min-w-0">
                            <h1 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {title}
                            </h1>

                            <p className="hidden sm:block mt-0.5 text-[10px] text-gray-400">
                                Admin dashboard
                            </p>
                        </div>
                    </div>

                    {/* =================================================
                        RIGHT
                    ================================================== */}

                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Notification */}
                        <AdminNotificationBell
                            notifications={notif.notifications}
                            notifCount={notif.notifCount}
                            showNotifList={notif.showNotifList}
                            onToggle={() => notif.setShowNotifList((value) => !value)}
                            onClose={() => notif.setShowNotifList(false)}
                            onMarkAllAsRead={notif.markAllAsRead}
                            onItemClick={notif.markAsRead}
                            formatTime={notif.formatTime}
                            isConnected={notif.isConnected}
                        />

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-7 bg-gray-200 dark:bg-gray-700 mx-1" />

                        {/* Admin Profile */}
                        <button
                            type="button"
                            className="flex items-center gap-2 pl-1 sm:pl-0 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                            <AdminAvatar name={adminName} />

                            <div className="hidden md:block text-left max-w-[140px]">
                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                                    {adminName}
                                </p>

                                <p className="text-[10px] text-gray-400">Administrator</p>
                            </div>

                            <ChevronDown className="hidden md:block w-3.5 h-3.5 text-gray-400" />
                        </button>
                    </div>
                </div>
            </header>

            {/* =====================================================
                MOBILE NOTIFICATION PANEL
            ====================================================== */}

            <AdminNotificationPanel
                show={notif.showNotifList}
                notifications={notif.notifications}
                notifCount={notif.notifCount}
                onClose={() => notif.setShowNotifList(false)}
                onMarkAllAsRead={notif.markAllAsRead}
                onItemClick={notif.markAsRead}
                formatTime={notif.formatTime}
            />
        </>
    );
}
