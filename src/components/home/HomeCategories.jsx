/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
    {
        name: "Cincin Emas",
        slug: "Cincin Emas",
        image: "/cat-cincin.jpg",
        desc: "Cincin elegan untuk setiap momen",
        objectFit: "object-contain p-2 bg-[#F9F9F9] dark:bg-gray-800",
    },
    {
        name: "Kalung",
        slug: "Kalung",
        image: "/cat-kalung.jpg",
        desc: "Sentuhan mewah yang memikat",
        objectFit: "object-cover object-center",
    },
    {
        name: "Gelang",
        slug: "Gelang",
        image: "/cat-gelang.jpg",
        desc: "Perhiasan tangan berkelas",
        objectFit: "object-contain p-3 bg-white dark:bg-gray-800",
    },
    {
        name: "Anting",
        slug: "Anting",
        image: "/cat-anting.jpg",
        desc: "Elegan untuk tampilan sehari-hari",
        objectFit: "object-contain p-3 bg-white dark:bg-gray-800",
    },
    {
        name: "Logam Mulia",
        slug: "Logam Mulia",
        image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=85",
        desc: "Pilihan investasi bernilai",
        objectFit: "object-cover",
    },
    {
        name: "Set Perhiasan",
        slug: "Set Perhiasan",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=85",
        desc: "Koleksi lengkap untuk hadiah",
        objectFit: "object-cover",
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 25,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export default function HomeCategories() {
    return (
        <section className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    className="flex items-end justify-between gap-6 mb-8"
                >
                    <div>
                        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 mb-2">
                            Jelajahi Koleksi
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Belanja Berdasarkan Kategori
                        </h2>

                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xl">
                            Temukan perhiasan pilihan kami berdasarkan kategori yang sesuai dengan
                            gaya dan kebutuhan Anda.
                        </p>
                    </div>

                    <Link
                        to="/katalog"
                        className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                        Lihat Semua
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {/* Categories */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
                >
                    {categories.map((category) => (
                        <motion.div
                            key={category.name}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                        >
                            <Link
                                to={`/katalog?kategori=${encodeURIComponent(category.slug)}`}
                                className="group block overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-amber-300 dark:hover:border-amber-700 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/4.5] overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        loading="lazy"
                                        className={`w-full h-full ${category.objectFit || "object-cover"} transition-transform duration-700 group-hover:scale-110`}
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                                    {/* Category name on image */}
                                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                                        <h3 className="text-sm sm:text-[15px] font-bold text-white leading-tight">
                                            {category.name}
                                        </h3>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="p-3 sm:p-4">
                                    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                                        {category.desc}
                                    </p>

                                    <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        Lihat koleksi
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Mobile CTA */}
                <div className="mt-6 md:hidden">
                    <Link
                        to="/katalog"
                        className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 active:scale-[0.98] transition-all"
                    >
                        Lihat Semua Kategori
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
