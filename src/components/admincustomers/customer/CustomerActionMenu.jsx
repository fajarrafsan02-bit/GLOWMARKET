import { motion as Motion, AnimatePresence } from "framer-motion";

import { Ban, CheckCircle, Edit3, Eye } from "lucide-react";

export default function CustomerActionMenu({ open, onClose, onView, onEdit, onDisable, isActive = true }) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <div
                        className="fixed inset-0 z-20 cursor-default"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onClose) {
                                onClose();
                            }
                        }}
                    />

                    <Motion.div
                        initial={{
                            opacity: 0,
                            y: -4,
                            scale: 0.98,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: -4,
                            scale: 0.98,
                        }}
                        transition={{
                            duration: 0.15,
                        }}
                        className="absolute right-0 top-9 z-30 w-44 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden"
                    >
                        <button
                            type="button"
                            onClick={onView}
                            className="w-full px-3 py-2.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition"
                        >
                            <Eye className="w-3.5 h-3.5 text-gray-400" />
                            Lihat Detail
                        </button>

                        <button
                            type="button"
                            onClick={onEdit}
                            className="w-full px-3 py-2.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition"
                        >
                            <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                            Edit Profil
                        </button>

                        <button
                            type="button"
                            onClick={onDisable}
                            className={` w-full px-3 py-2.5 text-left text-xs flex items-center gap-2 transition ${isActive ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"} `}
                        >
                            {isActive ? (
                                <>
                                    <Ban className="w-3.5 h-3.5 text-red-500" />
                                    Nonaktifkan User
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                    Aktifkan User
                                </>
                            )}
                        </button>
                    </Motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
