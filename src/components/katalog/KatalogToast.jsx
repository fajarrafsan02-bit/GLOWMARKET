import { motion as Motion, AnimatePresence } from "framer-motion";

export default function KatalogToast({ notice }) {
    return (
        <AnimatePresence>
            {notice && (
                <Motion.div
                    initial={{ y: 60, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 40, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", damping: 28, stiffness: 350 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="flex items-center gap-3 px-6 py-3.5 bg-gray-900 text-white rounded-full shadow-2xl shadow-gray-900/20">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                            <svg
                                className="w-3.5 h-3.5 text-amber-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </span>

                        <span className="text-[13px] font-medium tracking-tight whitespace-nowrap">
                            {notice}
                        </span>
                    </div>
                </Motion.div>
            )}
        </AnimatePresence>
    );
}
