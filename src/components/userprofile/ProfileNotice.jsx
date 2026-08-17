import { motion as Motion } from "framer-motion";

export default function ProfileNotice({ notice, noticeType }) {
    if (!notice) {
        return null;
    }

    return (
        <Motion.div
            initial={{
                opacity: 0,
                y: -10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className={`mb-5 px-4 py-3 border text-sm ${
                noticeType === "error"
                    ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400"
            }`}
        >
            {notice}
        </Motion.div>
    );
}
