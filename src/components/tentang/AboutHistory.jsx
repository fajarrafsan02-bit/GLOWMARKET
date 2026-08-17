/* eslint-disable no-unused-vars */

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export default function AboutHistory() {
    const store = useStoreSettings();

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{
                once: true,
                amount: 0.15,
            }}
            variants={sectionVariants}
            className="mb-32"
        >
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
                <motion.span
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="text-xs md:text-sm uppercase tracking-[0.3em] font-medium text-amber-600 dark:text-amber-400"
                >
                    Our Story · Est. 1985
                </motion.span>

                <motion.h2
                    initial={{
                        opacity: 0,
                        y: 25,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.8,
                        delay: 0.1,
                    }}
                    className="mt-4 sm:mt-5 text-3xl sm:text-4xl md:text-6xl font-serif font-medium leading-tight tracking-tight text-gray-900 dark:text-white"
                >
                    Dibangun dari kepercayaan,
                    <br />
                    <span className="text-amber-600 dark:text-amber-400">
                        diwariskan melalui generasi.
                    </span>
                </motion.h2>
            </div>

            {/* Story Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Image */}
                <motion.div
                    initial={{
                        opacity: 0,
                        x: -40,
                    }}
                    whileInView={{
                        opacity: 1,
                        x: 0,
                    }}
                    viewport={{
                        once: true,
                        amount: 0.2,
                    }}
                    transition={{
                        duration: 0.9,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="lg:col-span-5"
                >
                    <div className="relative group overflow-hidden">
                        <img
                            src="http://googleusercontent.com/image_generation_content/470"
                            alt={`Showroom ${store.name}`}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src =
                                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";
                            }}
                            className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105"
                        />

                        {/* Image Label */}
                        <div className="absolute bottom-5 left-5 px-4 py-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm text-[10px] uppercase tracking-[0.2em] text-gray-800 dark:text-gray-200">
                            Bandung · 1985
                        </div>
                    </div>
                </motion.div>

                {/* Right Content */}
                <motion.div
                    initial={{
                        opacity: 0,
                        x: 40,
                    }}
                    whileInView={{
                        opacity: 1,
                        x: 0,
                    }}
                    viewport={{
                        once: true,
                        amount: 0.2,
                    }}
                    transition={{
                        duration: 0.9,
                        delay: 0.15,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="lg:col-span-7 lg:pl-8"
                >
                    <div className="max-w-xl">
                        {/* Intro */}
                        <p className="text-lg sm:text-xl md:text-2xl font-serif leading-relaxed text-gray-900 dark:text-gray-100">
                            {store.name} lahir dari sebuah keluarga yang percaya bahwa perhiasan
                            bukan hanya tentang emas, tetapi tentang kepercayaan, kenangan, dan
                            cerita yang diwariskan.
                        </p>

                        {/* Divider */}
                        <div className="w-16 h-px bg-amber-500 my-6 sm:my-8" />

                        {/* Body */}
                        <div className="space-y-4 sm:space-y-5 text-xs sm:text-sm md:text-base leading-7 text-gray-500 dark:text-gray-400">
                            <p>
                                Didirikan pada tahun{" "}
                                <span className="text-gray-900 dark:text-gray-200 font-medium">
                                    1985
                                </span>{" "}
                                di Bandung, {store.name} tumbuh dengan prinsip sederhana:
                                menghadirkan perhiasan berkualitas dengan pelayanan yang jujur dan
                                dapat dipercaya.
                            </p>

                            <p>
                                Selama lebih dari{" "}
                                <span className="text-gray-900 dark:text-gray-200 font-medium">
                                    39 tahun
                                </span>
                                , kami telah melayani ribuan pelanggan dan menjadi bagian dari
                                berbagai momen penting dalam kehidupan mereka.
                            </p>

                            <p>
                                Kini, perjalanan tersebut berlanjut ke dunia digital. Kami
                                menghadirkan pengalaman berbelanja yang lebih mudah tanpa kehilangan
                                nilai yang sejak awal menjadi fondasi {store.name}.
                            </p>
                        </div>

                        {/* CTA */}
                        <motion.button
                            whileHover={{
                                y: -3,
                            }}
                            className="group mt-6 sm:mt-8 inline-flex items-center gap-3 border-b border-gray-900 dark:border-gray-300 pb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200 hover:text-amber-600 hover:border-amber-600 dark:hover:text-amber-400 dark:hover:border-amber-400 transition-colors duration-300"
                        >
                            Mengenal {store.name}
                            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Stats */}
            <motion.div
                initial={{
                    opacity: 0,
                    y: 30,
                }}
                whileInView={{
                    opacity: 1,
                    y: 0,
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    duration: 0.7,
                    delay: 0.3,
                }}
                className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-gray-200 dark:border-gray-800 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
            >
                <div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900 dark:text-white">
                        1985
                    </p>

                    <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-[0.15em] text-gray-400">
                        Tahun Berdiri
                    </p>
                </div>

                <div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900 dark:text-white">
                        39+
                    </p>

                    <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-[0.15em] text-gray-400">
                        Tahun Pengalaman
                    </p>
                </div>

                <div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900 dark:text-white">
                        24K
                    </p>

                    <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-[0.15em] text-gray-400">
                        Gold Collection
                    </p>
                </div>

                <div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900 dark:text-white">
                        ∞
                    </p>

                    <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-[0.15em] text-gray-400">
                        Cerita Berharga
                    </p>
                </div>
            </motion.div>
        </motion.section>
    );
}
