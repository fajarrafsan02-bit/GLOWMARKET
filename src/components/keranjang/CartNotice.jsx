import { motion as Motion, AnimatePresence } from "framer-motion";

export default function CartNotice({ notice }) {
    return (
        <AnimatePresence>
            {notice && (
                <Motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-5 px-4 py-3 border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20 text-sm text-emerald-700 dark:text-emerald-400"
                >
                    {notice}
                </Motion.div>
            )}
        </AnimatePresence>
    );
}
