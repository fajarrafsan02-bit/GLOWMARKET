import { Edit3, X } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

export default function FeatureComingSoonToast({ show, onClose }) {
    return (
        <AnimatePresence>
            {show && (
                <Motion.div
                    initial={{
                        opacity: 0,
                        y: 12,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    exit={{
                        opacity: 0,
                        y: 12,
                    }}
                    className="fixed left-1/2 bottom-5 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm px-4 py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl flex items-center gap-3"
                >
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-amber-500 flex items-center justify-center">
                        <Edit3 className="w-4 h-4 text-white" />
                    </div>

                    <div className="flex-1">
                        <p className="text-xs font-semibold">Fitur mendatang</p>

                        <p className="mt-0.5 text-[10px] opacity-60">Fitur ini akan segera hadir.</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/10 dark:hover:bg-black/10"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </Motion.div>
            )}
        </AnimatePresence>
    );
}
