import { AnimatePresence, motion as Motion } from "framer-motion";

export default function CustomerDetailShell({ show, onClose, children }) {
    return (
        <AnimatePresence>
            {show && (
                <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/35 backdrop-blur-sm"
                >
                    <Motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        onClick={(event) => event.stopPropagation()}
                        className="w-full max-w-xl max-h-[95vh] flex flex-col rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden"
                    >
                        {children}
                    </Motion.div>
                </Motion.div>
            )}
        </AnimatePresence>
    );
}
