/* eslint-disable no-unused-vars */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock3, Phone, Mail, ArrowUpRight } from "lucide-react";

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

export default function AboutLocation() {
    const store = useStoreSettings();

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        store.address,
    )}`;

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{
                once: true,
                amount: 0.15,
            }}
            variants={sectionVariants}
            className="mb-16"
        >
            {/* Section Heading */}
            <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
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
                    transition={{ duration: 0.6 }}
                    className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.3em] font-medium text-amber-600 dark:text-amber-400"
                >
                    Visit Us
                </motion.span>

                <motion.h2
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.7,
                        delay: 0.1,
                    }}
                    className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl font-serif font-medium tracking-tight text-gray-900 dark:text-white"
                >
                    Kunjungi Boutique
                    <br />
                    <span className="text-amber-600 dark:text-amber-400">{store.name}</span>
                </motion.h2>

                <motion.p
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.7,
                        delay: 0.2,
                    }}
                    className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base leading-6 sm:leading-7 text-gray-500 dark:text-gray-400"
                >
                    Nikmati pengalaman melihat koleksi perhiasan secara langsung dan konsultasikan
                    kebutuhan Anda bersama tim {store.name}.
                </motion.p>
            </div>

            {/* Store Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                {/* Store Image */}
                <motion.div
                    initial={{
                        opacity: 0,
                        x: -30,
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
                    className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-[600px] overflow-hidden group"
                >
                    <img
                        src="https://www.shutterstock.com/image-photo/jewelry-store-600nw-2574114597.jpg"
                        alt={`Interior boutique ${store.name}`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />

                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                    {/* Location Badge */}
                    <div className="absolute left-4 sm:left-6 bottom-4 sm:bottom-6 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm text-gray-900 dark:text-white">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />

                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] font-medium">
                            Bandung, Indonesia
                        </span>
                    </div>
                </motion.div>

                {/* Store Information */}
                <motion.div
                    initial={{
                        opacity: 0,
                        x: 30,
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
                    className="p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center"
                >
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-400">
                        {store.name} Boutique
                    </span>

                    <h3 className="mt-4 text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white">
                        Bandung
                    </h3>

                    <div className="w-12 h-px bg-amber-500 my-7" />

                    {/* Address */}
                    <div className="flex gap-4">
                        <MapPin className="w-5 h-5 shrink-0 mt-1 text-amber-600 dark:text-amber-400" />

                        <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                                Address
                            </p>

                            <p className="mt-2 text-sm md:text-base leading-7 text-gray-700 dark:text-gray-300">
                                {store.address}
                            </p>
                        </div>
                    </div>

                    {/* Opening Hours */}
                    <div className="flex gap-4 mt-7">
                        <Clock3 className="w-5 h-5 shrink-0 mt-1 text-amber-600 dark:text-amber-400" />

                        <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                                Opening Hours
                            </p>

                            <p className="mt-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
                                Senin — Minggu
                            </p>

                            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                                09:00 — 18:00 WIB
                            </p>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-3 mt-7">
                        <div className="flex items-center gap-4">
                            <Phone className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />

                            <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                                {store.phone}
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <Mail className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />

                            <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                                {store.email}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                        {/* Google Maps */}
                        <motion.a
                            whileHover={{ y: -3 }}
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium transition-all duration-300 hover:bg-amber-600 dark:hover:bg-amber-400"
                        >
                            Get Directions
                            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </motion.a>

                        {/* Contact */}
                        <motion.div whileHover={{ y: -3 }}>
                            <Link
                                to="/kontak"
                                className="group inline-flex items-center justify-center gap-3 px-6 py-3.5 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium transition-all duration-300 hover:border-amber-600 hover:text-amber-600 dark:hover:border-amber-400 dark:hover:text-amber-400"
                            >
                                Hubungi Kami
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}
