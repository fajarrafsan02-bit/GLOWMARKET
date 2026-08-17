/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Edit2, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const containerVariants = {
    hidden: {
        opacity: 0,
    },

    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        x: -8,
    },

    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.25,
        },
    },
};

export default function ProfileSidebar({
    userName,
    userEmail,
    tabs,
    activeTab,
    onSelectTab,
    onEditProfile,
    onLogoutClick,
}) {
    const initial = userName?.trim()?.charAt(0)?.toUpperCase() || "U";
    const navigate = useNavigate();

    return (
        <motion.aside
            initial={{
                opacity: 0,
                x: -15,
            }}
            animate={{
                opacity: 1,
                x: 0,
            }}
            transition={{
                duration: 0.3,
            }}
            className="w-full lg:w-auto"
        >
            <div className="overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
                {/* =====================================================
                    USER HEADER
                ====================================================== */}
                <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center justify-center text-base sm:text-lg font-bold">
                            {initial}
                        </div>

                        {/* User */}
                        <div className="min-w-0 flex-1">
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {userName || "Member GlowMarket"}
                            </h3>

                            <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                {userEmail || "email@contoh.com"}
                            </p>
                        </div>
                    </div>

                    {/* Edit Profile */}
                    <button
                        type="button"
                        onClick={onEditProfile}
                        className="mt-3 sm:mt-4 w-full h-8 sm:h-9 flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[11px] sm:text-xs font-medium hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Profil
                    </button>
                </div>

                {/* =====================================================
                    NAVIGATION
                ====================================================== */}
                <nav
                    aria-label="Navigasi akun"
                    className="border-t border-gray-100 dark:border-gray-800"
                >
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="p-2"
                    >
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const active = activeTab === tab.id;

                            return (
                                <motion.button
                                    key={tab.id}
                                    variants={itemVariants}
                                    type="button"
                                    onClick={() => {
                                        if (tab.isLink && tab.href) {
                                            navigate(tab.href);
                                        } else {
                                            onSelectTab(tab.id);
                                        }
                                    }}
                                    className={` relative w-full min-h-[40px] sm:min-h-[48px] flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-left transition-colors duration-200 ${active ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"} `}
                                >
                                    {/* Active indicator */}
                                    {active && (
                                        <span className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                                    )}

                                    {/* Icon */}
                                    <div
                                        className={` w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center ${active ? "bg-white dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-800"} `}
                                    >
                                        <Icon
                                            className={` w-3.5 h-3.5 sm:w-4 sm:h-4 ${active ? "text-amber-600 dark:text-amber-400" : "text-gray-500 dark:text-gray-400"} `}
                                        />
                                    </div>

                                    {/* Label */}
                                    <div className="min-w-0 flex-1">
                                        <span
                                            className={` block text-[11px] sm:text-sm ${active ? "font-semibold" : "font-medium"} `}
                                        >
                                            {tab.label}
                                        </span>

                                        {tab.description && (
                                            <span className="block mt-0.5 text-[10px] text-gray-400 dark:text-gray-500 truncate">
                                                {tab.description}
                                            </span>
                                        )}
                                    </div>

                                    {active && (
                                        <ChevronRight className="w-4 h-4 shrink-0 text-amber-500" />
                                    )}
                                </motion.button>
                            );
                        })}

                        {/* =================================================
                            LOGOUT
                        ================================================== */}
                        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                            <motion.button
                                variants={itemVariants}
                                type="button"
                                onClick={onLogoutClick}
                                className="w-full min-h-[44px] px-3 py-2.5 rounded-lg flex items-center gap-3 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <div className="w-8 h-8 shrink-0 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                                    <LogOut className="w-4 h-4" />
                                </div>

                                <span>Keluar</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </nav>
            </div>
        </motion.aside>
    );
}
