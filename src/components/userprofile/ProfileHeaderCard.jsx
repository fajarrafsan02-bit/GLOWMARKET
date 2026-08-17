import { User, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

export default function ProfileHeaderCard({ userName, userEmail, userPhone }) {
    return (
        <Motion.section
            initial={{
                opacity: 0,
                y: 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mb-5"
        >
            <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <User className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>

                {/* User */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 uppercase tracking-[0.12em]">Akun Saya</p>

                    <h1 className="mt-1 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                        {userName}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {userEmail}
                        {userPhone ? ` · ${userPhone}` : ""}
                    </p>
                </div>

                {/* Shopping CTA */}
                <Link
                    to="/katalog"
                    className="h-10 px-4 inline-flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-amber-400 hover:text-amber-600 transition-all"
                >
                    <ShoppingBag className="w-4 h-4" />
                    Belanja
                </Link>
            </div>
        </Motion.section>
    );
}
