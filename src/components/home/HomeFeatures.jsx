/* eslint-disable no-unused-vars */
import { ShieldCheck, Truck, CreditCard, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HomeFeatures() {
    const features = [
        {
            icon: ShieldCheck,
            title: "Emas Asli 100%",
            desc: "Semua produk dilengkapi sertifikat keaslian resmi dari LM atau Antam",
        },
        {
            icon: Truck,
            title: "Pengiriman Aman",
            desc: "Gratis ongkir min. 5 juta. Packing anti-gores dengan asuransi",
        },
        {
            icon: CreditCard,
            title: "Pembayaran Mudah",
            desc: "Transfer bank, kartu kredit, dan COD untuk area tertentu",
        },
        {
            icon: Sparkles,
            title: "Desain Eksklusif",
            desc: "Koleksi limited edition dengan desain modern dan elegan",
        },
    ];

    return (
        <section className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-12 space-y-3"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Mengapa Memilih Kami
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
                        Kami memberikan pelayanan terbaik dengan jaminan kualitas produk dan
                        kepuasan pelanggan
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: i * 0.1,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            whileHover={{ y: -4 }}
                            className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-11 h-11 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <item.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>

                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                                {item.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
