import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { motion as Motion } from "framer-motion";

export default function CartEmpty() {
    return (
        <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 py-16 px-6 text-center"
        >
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-gray-400" />
            </div>

            <h2 className="mt-5 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Keranjang masih kosong
            </h2>

            <p className="mt-2 max-w-md mx-auto text-sm leading-6 text-gray-500 dark:text-gray-400">
                Tambahkan perhiasan favorit Anda dari katalog untuk melanjutkan belanja.
            </p>

            <Link
                to="/katalog"
                className="mt-6 inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition"
            >
                Mulai Belanja
                <ArrowRight className="w-4 h-4" />
            </Link>
        </Motion.div>
    );
}
