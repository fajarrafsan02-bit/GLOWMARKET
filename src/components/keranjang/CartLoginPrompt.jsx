import { ShoppingBag } from "lucide-react";
import { motion as Motion } from "framer-motion";

import Header from "../Header.jsx";
import Footer from "../Footer.jsx";

export default function CartLoginPrompt({ setShowAuth }) {
    return (
        <>
            <Header setShowAuth={setShowAuth} />

            <main className="min-h-[70vh] bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-16">
                <Motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md text-center"
                >
                    <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-5">
                        <ShoppingBag className="w-7 h-7 text-gray-400" />
                    </div>

                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                        Masuk untuk melihat keranjang
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Produk yang Anda tambahkan ke keranjang tersimpan di akun Anda.
                    </p>

                    <button
                        type="button"
                        onClick={() => setShowAuth?.(true)}
                        className="mt-6 h-11 px-6 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition"
                    >
                        Masuk / Daftar
                    </button>
                </Motion.div>
            </main>

            <Footer />
        </>
    );
}
