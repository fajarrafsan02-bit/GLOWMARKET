import { motion as Motion, AnimatePresence } from "framer-motion";
import { X, Bell, CheckCheck } from "lucide-react";

import { NotificationList } from "./AdminNotificationBell.jsx";

export default function AdminNotificationPanel({
    show,
    notifications,
    notifCount,
    onClose,
    onMarkAllAsRead,
    onItemClick,
    formatTime,
}) {
    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* =================================================
                        BACKDROP
                    ================================================== */}

                    <Motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        onClick={onClose}
                        className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-[1px] z-40"
                    />

                    {/* =================================================
                        MOBILE PANEL
                    ================================================== */}

                    <Motion.div
                        initial={{
                            opacity: 0,
                            y: -12,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -12,
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                        className="md:hidden fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col bg-white dark:bg-gray-950"
                    >
                        {/* =================================================
                            HEADER
                        ================================================== */}

                        <div className="shrink-0 h-14 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                    <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Notifikasi
                                    </h2>

                                    <p className="text-[10px] text-gray-400">
                                        {notifCount > 0
                                            ? `${notifCount} belum dibaca`
                                            : "Semua sudah dibaca"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                                {notifCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onMarkAllAsRead();
                                        }}
                                        className="h-8 px-2.5 rounded-md inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition"
                                    >
                                        <CheckCheck className="w-3.5 h-3.5" />
                                        Tandai dibaca
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                    aria-label="Tutup notifikasi"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* =================================================
                            CONTENT
                        ================================================== */}

                        <div className="flex-1 min-h-0 overflow-hidden bg-[#fafafa] dark:bg-gray-950">
                            <NotificationList
                                notifications={notifications}
                                onItemClick={onItemClick}
                                formatTime={formatTime}
                            />
                        </div>
                    </Motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
