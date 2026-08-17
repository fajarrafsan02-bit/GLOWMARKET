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
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const galleryVariants = {
    hidden: {
        opacity: 0,
        y: 35,
    },

    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const galleryImages = [
    {
        src: "https://m.media-amazon.com/images/I/61PDVrPg6eL._AC_UY1000_.jpg",
        title: "Timeless Collection",
        category: "Rings",
    },
    {
        src: "https://m.media-amazon.com/images/I/71ZPemLN84L._AC_UY1000_.jpg",
        title: "Golden Elegance",
        category: "Necklaces",
    },
    {
        src: "https://m.media-amazon.com/images/I/61u-9+qC0tL._AC_UY1000_.jpg",
        title: "Classic Beauty",
        category: "Bracelets",
    },
    {
        src: "https://www.findlayrowedesigns.com/cdn/shop/articles/Susan_Shaw_Jewelry_From_Findlay_Rowe_2000x.jpg?v=1699020981",
        title: "Modern Heritage",
        category: "Collection",
    },
    {
        src: "https://i.etsystatic.com/11281866/r/il/ab5eae/6357675511/il_fullxfull.6357675511_igfw.jpg",
        title: "Everyday Luxury",
        category: "Jewelry",
    },
    {
        src: "https://s.alicdn.com/@img/imgextra/i4/6000000000367/O1CN01n6Voif1Ea8JHhuOJT_!!6000000000367-0-tbvideo.jpg_720x720q50.jpg",
        title: "Signature Gold",
        category: "Collection",
    },
    {
        src: "https://i.etsystatic.com/11281866/r/il/176f50/5910621766/il_570xN.5910621766_3154.jpg",
        title: "Pure Craftsmanship",
        category: "Rings",
    },
    {
        src: "https://i.etsystatic.com/48714312/r/il/9195fb/5991744687/il_340x270.5991744687_1z98.jpg",
        title: "Golden Details",
        category: "Jewelry",
    },
];

export default function AboutGallery() {
    const store = useStoreSettings();

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={sectionVariants}
            className="mb-16 sm:mb-32"
        >
            {/* Header */}
            <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-16">
                <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.3em] font-medium text-amber-600 dark:text-amber-400"
                >
                    Our Collection
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.7,
                        delay: 0.1,
                    }}
                    className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-5xl font-serif font-medium tracking-tight text-gray-900 dark:text-white"
                >
                    Koleksi Unggulan
                    <br />
                    <span className="text-amber-600 dark:text-amber-400">{store.name}</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.7,
                        delay: 0.2,
                    }}
                    className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base leading-6 sm:leading-7 text-gray-500 dark:text-gray-400"
                >
                    Temukan berbagai koleksi perhiasan yang dirancang untuk menemani setiap momen
                    berharga Anda.
                </motion.p>
            </div>

            {/* Editorial Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:gap-5">
                {galleryImages.map((item, i) => (
                    <motion.div
                        key={item.src}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            amount: 0.15,
                        }}
                        variants={galleryVariants}
                        className={` relative overflow-hidden group cursor-pointer ${i === 0 ? "md:col-span-7 md:row-span-2" : i === 1 ? "md:col-span-5" : i === 2 ? "md:col-span-5" : i === 3 ? "md:col-span-4" : i === 4 ? "md:col-span-4" : i === 5 ? "md:col-span-4" : i === 6 ? "md:col-span-5" : "md:col-span-7"} `}
                    >
                        {/* Image */}
                        <div
                            className={` relative overflow-hidden bg-gray-100 dark:bg-gray-900 ${i === 0 ? "aspect-[4/5]" : "aspect-[4/3]"} `}
                        >
                            <img
                                src={item.src}
                                alt={`${item.title} - ${store.name}`}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-500" />

                            {/* Content */}
                            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                <div className="flex items-end justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/70">
                                            {item.category}
                                        </p>

                                        <h3 className="mt-1 text-base sm:text-lg md:text-xl font-serif text-white truncate">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full border border-white/60 flex items-center justify-center text-white">
                                        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                    duration: 0.7,
                    delay: 0.2,
                }}
                className="flex justify-center mt-12"
            >
                <button className="group inline-flex items-center gap-3 border-b border-gray-900 dark:border-white pb-2 text-sm font-medium text-gray-900 dark:text-white transition-colors hover:text-amber-600 hover:border-amber-600 dark:hover:text-amber-400 dark:hover:border-amber-400">
                    Explore Our Collection
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
            </motion.div>
        </motion.section>
    );
}
