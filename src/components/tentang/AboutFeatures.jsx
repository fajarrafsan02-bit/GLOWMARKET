/* eslint-disable no-unused-vars */
import { ShieldCheck, Clock3, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import useStoreSettings from "../../hooks/useStoreSettings.js";

const sectionVariants = {
    hidden: {
        opacity: 0,
        y: 50,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const features = [
    {
        number: "01",
        icon: ShieldCheck,
        title: "Emas Murni & Terpercaya",
        desc: "Setiap produk memiliki sertifikat resmi dan melalui proses autentikasi untuk memastikan keaslian serta kualitas emas.",
    },
    {
        number: "02",
        icon: Clock3,
        title: "Berpengalaman Sejak 1985",
        desc: "Lebih dari 39 tahun menghadirkan perhiasan berkualitas dan membangun kepercayaan pelanggan dari generasi ke generasi.",
    },
    {
        number: "03",
        icon: Sparkles,
        title: "Elegan & Personal",
        desc: "Temukan koleksi modern hingga klasik, atau wujudkan desain perhiasan yang dibuat khusus sesuai keinginan Anda.",
    },
];

export default function AboutFeatures() {
    const store = useStoreSettings();

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="mb-16 sm:mb-28"
        >
            {/* Header */}
            <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-16">
                <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-[10px] sm:text-xs md:text-sm tracking-[0.3em] uppercase text-amber-600 dark:text-amber-400 font-medium"
                >
                    {store.name}
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-5xl font-serif font-medium tracking-tight text-gray-900 dark:text-white"
                >
                    Mengapa Memilih
                    <br />
                    <span className="text-amber-600 dark:text-amber-400">{store.name}?</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base leading-6 sm:leading-7 text-gray-500 dark:text-gray-400"
                >
                    Lebih dari sekadar perhiasan. Kami menghadirkan kualitas, kepercayaan, dan
                    desain yang memiliki makna untuk setiap momen berharga Anda.
                </motion.p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-y border-gray-200 dark:border-gray-800">
                {features.map((item, i) => {
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={item.number}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={cardVariants}
                            whileHover={{ y: -4 }}
                            className={` group relative p-6 sm:p-8 md:p-10 lg:p-12 bg-white dark:bg-gray-950 transition-all duration-500 ${i !== features.length - 1 ? "border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800" : ""} `}
                        >
                            {/* Number */}
                            <div className="flex items-center justify-between mb-8 sm:mb-10">
                                <span className="text-xs tracking-[0.2em] text-gray-400 dark:text-gray-600">
                                    {item.number}
                                </span>

                                <div className="w-10 h-10 flex items-center justify-center rounded-full border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 transition-all duration-500 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500">
                                    <Icon className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl md:text-2xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-4">
                                {item.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm leading-7 text-gray-500 dark:text-gray-400">
                                {item.desc}
                            </p>

                            {/* Bottom line */}
                            <div className="mt-8 h-px w-0 bg-amber-500 transition-all duration-500 group-hover:w-16" />
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
}
