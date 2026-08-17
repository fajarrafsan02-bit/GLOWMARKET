import { AnimatePresence, motion as Motion } from "framer-motion";

export default function ReviewError({ error }) {
    return (
        <AnimatePresence>
            {error && (
                <Motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400"
                >
                    {error}
                </Motion.div>
            )}
        </AnimatePresence>
    );
}
