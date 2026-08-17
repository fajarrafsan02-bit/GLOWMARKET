/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function ContactHero() {
    return (
        <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative bg-gradient-to-r from-amber-600 to-yellow-700 dark:from-amber-700 dark:to-yellow-800 text-white py-24 overflow-hidden shadow-2xl"
        >
            <div className="absolute inset-0 opacity-40 dark:opacity-60">
                <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Interior toko perhiasan emas mewah"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="relative max-w-5xl mx-auto px-4 text-center">
                <motion.h1
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-2xl"
                >
                    Hubungi Kami <Sparkles className="inline w-12 h-12 ml-4 animate-pulse" />
                </motion.h1>
                <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed"
                >
                    Kami siap membantu Anda menemukan perhiasan emas impian.
                    <br />
                    Kunjungi toko atau hubungi kami kapan saja!
                </motion.p>
            </div>
        </motion.div>
    );
}
