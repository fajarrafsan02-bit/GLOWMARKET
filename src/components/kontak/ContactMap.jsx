/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

export default function ContactMap() {
    return (
        <motion.div
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mb-20"
        >
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-10">
                Lokasi Toko Kami
            </h2>
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="rounded-3xl overflow-hidden shadow-2xl border-8 border-amber-200 dark:border-yellow-700/50"
            >
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798575290955!2d107.6290143147565!3d-6.917463995002444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6388e9441f3%3A0x1b5b1c8e8b8b8b8b!2sJl.%20Ahmad%20Yani%20No.197%2C%20Cicadas%2C%20Kec.%20Cibeunying%20Kidul%2C%20Kota%20Bandung%2C%20Jawa%20Barat%2040114!5e0!3m2!1sid!2sid!4v1700000000000"
                    width="100%"
                    height="500"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi GlowMarket di Google Maps"
                />
            </motion.div>
        </motion.div>
    );
}
