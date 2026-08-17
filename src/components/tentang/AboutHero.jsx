/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import useStoreSettings from "../../hooks/useStoreSettings.js";

export default function AboutHero() {
    const store = useStoreSettings();

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative min-h-[78vh] md:min-h-[82vh] overflow-hidden bg-[#f5f3ee] dark:bg-[#0c0b09]"
        >
            {/* Background Image */}
            <motion.img
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{
                    duration: 1.6,
                    ease: [0.22, 1, 0.36, 1],
                }}
                src="https://www.shutterstock.com/image-photo/inside-diamond-store-warm-golden-600nw-2644254943.jpg"
                alt={`Interior toko perhiasan ${store.name}`}
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Image Overlay */}
            <div className="absolute inset-0 bg-black/35 md:bg-black/30" />

            {/* Soft Bottom Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content */}
            <div className="relative z-10 min-h-[78vh] md:min-h-[82vh] max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-end pb-16 md:pb-20">
                {/* Small Label */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.7,
                        delay: 0.2,
                    }}
                    className="flex items-center gap-3 mb-6"
                >
                    <span className="w-8 h-px bg-amber-400" />

                    <span className="text-[10px] md:text-xs uppercase tracking-[0.35em] font-medium text-white/80">
                        Est. 1985 · Bandung
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{
                        opacity: 0,
                        y: 40,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.9,
                        delay: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="max-w-4xl text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[0.95] tracking-tight text-white"
                >
                    Perhiasan yang
                    <br />
                    <span className="text-amber-300">memiliki cerita.</span>
                </motion.h1>

                {/* Description + CTA */}
                <div className="mt-6 sm:mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6 sm:gap-8">
                    <motion.p
                        initial={{
                            opacity: 0,
                            y: 25,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.8,
                            delay: 0.55,
                        }}
                        className="max-w-xl text-sm md:text-base leading-7 text-white/75"
                    >
                        Selama lebih dari tiga dekade, {store.name} menghadirkan perhiasan emas
                        berkualitas dengan perpaduan craftsmanship, kepercayaan, dan desain yang
                        timeless.
                    </motion.p>

                    <motion.button
                        initial={{
                            opacity: 0,
                            y: 25,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.8,
                            delay: 0.7,
                        }}
                        whileHover={{
                            y: -3,
                        }}
                        className="group shrink-0 inline-flex items-center gap-3 self-start md:self-auto px-6 py-3.5 border border-white/40 bg-white/10 backdrop-blur-sm text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-gray-900 hover:border-white"
                    >
                        Discover Our Story
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </motion.button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    delay: 1.2,
                    duration: 0.8,
                }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/60"
            >
                <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>

                <motion.div
                    animate={{
                        y: [0, 5, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <ArrowDown className="w-4 h-4" />
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
