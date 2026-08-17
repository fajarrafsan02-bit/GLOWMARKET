/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Award, ArrowRight, Star } from "lucide-react";

export default function HomeHero() {
    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: (i = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
        }),
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/80 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
            {/* Subtle background accent */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/40 dark:bg-amber-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-24">
                {/* Main hero content — centered */}
                <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
                    {/* Badge */}
                    <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200/60 dark:border-amber-700/30">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            Toko Emas Terpercaya
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={fadeUp}
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.15]"
                    >
                        Perhiasan Emas{" "}
                        <span className="text-amber-600 dark:text-amber-400">Premium</span>
                        <br className="hidden xs:inline" />
                        {" "}untuk Setiap Momen
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        variants={fadeUp}
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        className="text-xs xs:text-sm sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed"
                    >
                        Koleksi cincin, kalung, gelang & anting emas berkualitas tinggi dengan
                        sertifikat keaslian dan harga transparan.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={fadeUp}
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-wrap justify-center gap-3 pt-2"
                    >
                        <button
                            onClick={() =>
                                document
                                    .getElementById("products")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="group h-12 px-7 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 active:scale-[0.97] flex items-center gap-2"
                        >
                            Lihat Koleksi
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </motion.div>
                </div>

                {/* Trust bar */}
                <motion.div
                    variants={fadeUp}
                    custom={4}
                    initial="hidden"
                    animate="visible"
                    className="mt-14 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
                >
                    {[
                        {
                            icon: ShieldCheck,
                            title: "Emas Asli 100%",
                            desc: "Bersertifikat & terverifikasi",
                        },
                        {
                            icon: Truck,
                            title: "Pengiriman Aman",
                            desc: "Asuransi penuh & gratis ongkir*",
                        },
                        {
                            icon: Award,
                            title: "Garansi Buyback",
                            desc: "Jaminan beli kembali kapan saja",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-3.5 p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 shadow-sm"
                        >
                            <div className="w-10 h-10 shrink-0 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                <item.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {item.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
