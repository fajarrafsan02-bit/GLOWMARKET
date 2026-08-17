import { motion as Motion, AnimatePresence } from "framer-motion";

export default function CheckoutNotice({ notice, noticeType = "error" }) {
    return (
        <AnimatePresence>
            {notice && (
                <Motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100%-2rem)] px-4 py-3 rounded-lg shadow-xl text-sm font-medium text-white ${noticeType === "error" ? "bg-red-600" : "bg-emerald-600"}`}
                >
                    {notice}
                </Motion.div>
            )}
        </AnimatePresence>
    );
}
