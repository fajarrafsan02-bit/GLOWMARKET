/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { ShoppingBag, AlertTriangle, CreditCard, MessageCircle, CheckCircle2 } from "lucide-react";

export default function NotificationItem({ notif, index, onClick, formatTime }) {
    const getNotificationMeta = () => {
        switch (notif.type) {
            case "NEW_ORDER":
                return {
                    icon: ShoppingBag,
                    iconColor: "text-blue-600 dark:text-blue-400",
                    iconBg: "bg-blue-50 dark:bg-blue-900/20",
                };

            case "LOW_STOCK":
                return {
                    icon: AlertTriangle,
                    iconColor: "text-red-600 dark:text-red-400",
                    iconBg: "bg-red-50 dark:bg-red-900/20",
                };

            case "PAYMENT":
            case "PAYMENT_SUCCESS":
                return {
                    icon: CreditCard,
                    iconColor: "text-emerald-600 dark:text-emerald-400",
                    iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
                };

            case "CHAT":
            case "NEW_MESSAGE":
                return {
                    icon: MessageCircle,
                    iconColor: "text-violet-600 dark:text-violet-400",
                    iconBg: "bg-violet-50 dark:bg-violet-900/20",
                };

            case "ORDER_COMPLETED":
                return {
                    icon: CheckCircle2,
                    iconColor: "text-emerald-600 dark:text-emerald-400",
                    iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
                };

            default:
                return {
                    icon: ShoppingBag,
                    iconColor: "text-gray-500 dark:text-gray-400",
                    iconBg: "bg-gray-100 dark:bg-gray-800",
                };
        }
    };

    const { icon: NotifIcon, iconColor, iconBg } = getNotificationMeta();

    return (
        <motion.button
            type="button"
            initial={{
                opacity: 0,
                x: -8,
            }}
            animate={{
                opacity: 1,
                x: 0,
            }}
            transition={{
                delay: index * 0.03,
                duration: 0.2,
            }}
            onClick={() => onClick(notif)}
            className={` w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors border-l-2 ${!notif.isRead ? ` bg-amber-50/60 dark:bg-amber-900/10 border-l-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 ` : ` bg-white dark:bg-gray-900 border-l-transparent hover:bg-gray-50 dark:hover:bg-gray-800 `} `}
        >
            {/* Icon */}
            <div
                className={` w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${iconBg} `}
            >
                {NotifIcon && <NotifIcon className={` w-4 h-4 ${iconColor} `} />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                    <p
                        className={` flex-1 text-xs leading-5 ${!notif.isRead ? ` font-semibold text-gray-900 dark:text-white ` : ` font-medium text-gray-700 dark:text-gray-300 `} `}
                    >
                        {notif.title}
                    </p>

                    {/* Unread indicator */}
                    {!notif.isRead && (
                        <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-amber-500 shrink-0" />
                    )}
                </div>

                <p
                    className={` mt-1 text-[11px] leading-5 line-clamp-2 ${!notif.isRead ? ` text-gray-600 dark:text-gray-400 ` : ` text-gray-400 dark:text-gray-500 `} `}
                >
                    {notif.message}
                </p>

                <p className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                    {formatTime(notif.timestamp)}
                </p>
            </div>
        </motion.button>
    );
}
