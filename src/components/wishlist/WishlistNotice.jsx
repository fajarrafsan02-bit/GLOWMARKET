import { motion as Motion, AnimatePresence } from "framer-motion";

export default function WishlistNotice({ notice, noticeType }) {
    return (
        <AnimatePresence>
            {notice && (
                <Motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={` fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 text-sm font-medium shadow-xl ${noticeType === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"} `}
                >
                    {notice}
                </Motion.div>
            )}
        </AnimatePresence>
    );
}
