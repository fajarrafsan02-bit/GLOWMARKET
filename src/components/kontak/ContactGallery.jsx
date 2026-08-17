/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const galleryImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1573496791018-5f95c6c3e9a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518998053901-4e1d2da9d329?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
];

// Variants untuk galeri gambar
const galleryVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: (i) => ({
        scale: 1,
        opacity: 1,
        transition: {
            delay: i * 0.2,
            duration: 0.8,
            type: "spring",
        },
    }),
};

export default function ContactGallery() {
    return (
        <motion.div
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
        >
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-12">
                Kunjungi Kami Langsung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {galleryImages.map((src, i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={galleryVariants}
                        whileHover={{ scale: 1.08, y: -12 }}
                        className="rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <img
                            src={src}
                            alt={`Interior toko GlowMarket ${i + 1}`}
                            className="w-full h-80 object-cover transition-transform duration-700"
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
