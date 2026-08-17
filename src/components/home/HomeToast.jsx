/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function HomeToast({ notice }) {
    return (
        <AnimatePresence>
            {notice && (
                <motion.div
                    initial={{ y: 60, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 40, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", damping: 28, stiffness: 350 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="flex items-center gap-3 px-6 py-3.5 bg-slate-950 text-white rounded-full shadow-xl shadow-slate-950/20">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        </span>
                        <span className="text-[13px] font-medium tracking-tight whitespace-nowrap">
                            {notice}
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
