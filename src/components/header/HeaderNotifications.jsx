import { createPortal } from "react-dom";
import { Bell, CheckCheck, Star, X } from "lucide-react";

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
    navigate,
}) {
    /* Notifikasi hanya berarti bagi pengguna yang sudah masuk. Menampilkan
       loncengnya bagi tamu membuat header terasa penuh fitur yang sebenarnya
       tidak bisa dipakai — ajakan masuk sudah diwakili tombol tersendiri. */
    if (!isLoggedIn) {
        return null;
    }

    /* Isi panel dipakai dua kali: sebagai sheet di ponsel (lewat portal) dan
       sebagai dropdown biasa mulai sm, jadi dipisah agar tidak terduplikasi. */
    const isiPanel = (
        <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 shrink-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifikasi</h3>

                <div className="flex items-center gap-1">
                    {notificationCount > 0 && (
                        <button
                            onClick={markAllNotificationsAsRead}
                            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                            <CheckCheck className="w-3.5 h-3.5 shrink-0" />
                            <span className="whitespace-nowrap">Tandai dibaca</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => setShowNotifications(false)}
                        className="sm:hidden w-8 h-8 -mr-1.5 shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Tutup notifikasi"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Daftar. Padding bawah menyisakan ruang bagi bilah gestur ponsel
                agar entri terakhir tetap bisa disentuh. */}
            <div className="overflow-y-auto overscroll-contain flex-1 pb-[env(safe-area-inset-bottom)]">
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
                            className={`px-4 py-3.5 sm:py-3 border-b border-gray-50 dark:border-gray-700/50 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-750 active:bg-gray-100 dark:active:bg-gray-700 ${!notif.isRead ? "bg-amber-50/50 dark:bg-amber-900/10" : ""}`}
                        >
                            <div className="flex items-start gap-2.5 sm:gap-3">
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
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white break-words">
                                        {notif.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed break-words">
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
        </>
    );

    return (
        <div className="relative" ref={notificationRef}>
            <button
                onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications) fetchNotifications();
                }}
                className={`relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition-colors ${showNotifications ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                aria-label="Notifikasi"
                title="Notifikasi"
            >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {notificationCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                )}
            </button>

            {/* Sheet ponsel ditempatkan lewat portal ke body. Header memakai
                backdrop-blur, dan properti itu menjadikannya containing block
                bagi turunan position:fixed — tanpa portal, sheet akan berlabuh
                ke bilah header setinggi ~56px dan menempel di atas layar. */}
            {showNotifications &&
                createPortal(
                    <div
                        data-notif-sheet="true"
                        className="sm:hidden fixed inset-0 z-[100] flex flex-col justify-end"
                    >
                        <div
                            onClick={() => setShowNotifications(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                            aria-hidden="true"
                        />

                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-label="Notifikasi"
                            className="relative w-full max-h-[80vh] rounded-t-2xl border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden flex flex-col"
                        >
                            {/* Gagang geser: penanda lazim panel bisa ditutup. */}
                            <div className="pt-2.5 pb-1 flex justify-center shrink-0">
                                <span className="w-9 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                            </div>

                            {isiPanel}
                        </div>
                    </div>,
                    document.body,
                )}

            {/* Mulai sm tetap dropdown yang berlabuh pada lonceng. */}
            {showNotifications && (
                <div
                    role="dialog"
                    aria-label="Notifikasi"
                    className="hidden sm:flex absolute right-0 mt-2 w-96 max-h-[70vh] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-hidden flex-col"
                >
                    {isiPanel}
                </div>
            )}
        </div>
    );
}
