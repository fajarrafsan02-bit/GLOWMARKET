import { CheckCircle } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

export default function AuthMessages({ notice, error }) {
    return (
        <div className="px-6">
            <AnimatePresence mode="wait">
                {notice && (
                    <Motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-4 p-3 flex items-start gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-400"
                    >
                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{notice}</span>
                    </Motion.div>
                )}

                {error && (
                    <Motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-400"
                    >
                        {error}
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
