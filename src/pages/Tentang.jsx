import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import { Sparkles, Shield, Clock, Heart, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Tentang() {
    const [showAuth, setShowAuth] = useState(false);
    // Variants untuk stagger animation
    const sectionVariants = {
        hidden: { y: 60, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                type: "spring",
                stiffness: 80,
            },
        },
    };

    const cardVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: (i) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: i * 0.15,
                duration: 0.7,
                type: "spring",
            },
        }),
    };

    const galleryVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: (i) => ({
            scale: 1,
            opacity: 1,
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                type: "spring",
            },
        }),
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white dark:from-black dark:to-gray-950 overflow-x-hidden transition-all duration-700"
        >
            <Header setShowAuth={setShowAuth} />

            {/* Hero Section */}
            <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, type: "spring" }}
                className="relative bg-gradient-to-r from-amber-600 to-yellow-700 dark:from-amber-700 dark:to-yellow-800 text-white py-24 overflow-hidden shadow-2xl"
            >
                <div className="absolute inset-0 opacity-40 dark:opacity-60">
                    <img
                        src="https://www.shutterstock.com/image-photo/inside-diamond-store-warm-golden-600nw-2644254943.jpg"
                        alt="Interior toko emas mewah"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative max-w-5xl mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-2xl"
                    >
                        Tentang Fajar Gold <Sparkles className="inline w-12 h-12 ml-4 animate-pulse" />
                    </motion.h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed"
                    >
                        Toko perhiasan emas terpercaya sejak 1985 di Bandung.<br />
                        Menyediakan emas murni 24K bersertifikat dengan desain elegan dan kualitas tertinggi.
                    </motion.p>
                </div>
            </motion.div>

            <div className="max-w-5xl mx-auto px-4 py-16">
                {/* Sejarah Kami */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={sectionVariants}
                    className="grid md:grid-cols-2 gap-12 items-center mb-20"
                >
                    <div>
                        <motion.h2
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8"
                        >
                            Sejarah Kami
                        </motion.h2>
                        <div className="space-y-5 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                            <p>
                                Didirikan pada tahun{" "}
                                <span className="text-amber-600 dark:text-yellow-400 font-bold">1985</span> di jantung kota Bandung, Fajar Gold lahir dari passion keluarga untuk menghadirkan perhiasan emas berkualitas tinggi yang accessible bagi semua kalangan.
                            </p>
                            <p>
                                Selama lebih dari{" "}
                                <span className="text-amber-600 dark:text-yellow-400 font-bold">39 tahun</span>, kami telah melayani ribuan pelanggan setia dengan prinsip kejujuran, kualitas, dan pelayanan terbaik.
                            </p>
                            <p>
                                Kini, kami hadir secara online untuk memudahkan Anda memiliki emas murni bersertifikat Antam dan perhiasan custom langsung dari rumah — dengan kepercayaan yang sama seperti di toko fisik kami.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <motion.img
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ scale: 1.08, y: -10 }}
                            src="https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3505342581205192499"
                            alt="Showroom Fajar Gold elegan"
                            className="rounded-3xl shadow-2xl object-cover h-72 w-full"
                        />
                        <motion.img
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.08, y: -10 }}
                            src="https://www.shutterstock.com/image-photo/jewelry-store-600nw-2574114597.jpg"
                            alt="Interior toko emas luxury"
                            className="rounded-3xl shadow-2xl object-cover h-72 w-full mt-16"
                        />
                    </div>
                </motion.div>

                {/* Keunggulan Kami */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={sectionVariants}
                    className="mb-20"
                >
                    <motion.h2
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-12"
                    >
                        Mengapa Memilih Fajar Gold?
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: Shield,
                                title: "Emas Murni Bersertifikat",
                                desc: "Setiap produk dilengkapi sertifikat resmi Antam & autentikasi keaslian",
                            },
                            {
                                icon: Clock,
                                title: "Pengalaman 39+ Tahun",
                                desc: "Dipercaya ribuan pelanggan dari generasi ke generasi sejak 1985",
                            },
                            {
                                icon: Heart,
                                title: "Desain Elegan & Custom",
                                desc: "Koleksi modern hingga klasik, bisa custom sesuai impian Anda",
                            },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={i}
                                    custom={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={cardVariants}
                                    whileHover={{ y: -12, scale: 1.05 }}
                                    className="bg-white dark:bg-gray-900/95 rounded-3xl shadow-2xl p-10 text-center border border-amber-100 dark:border-yellow-800/40 backdrop-blur-sm transition-all duration-500"
                                >
                                    <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 dark:from-amber-500 dark:to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                        <Icon className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                                        {item.title}
                                    </h3>
                                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Galeri Koleksi */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={sectionVariants}
                    className="mb-20"
                >
                    <motion.h2
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-12"
                    >
                        Koleksi Unggulan Kami
                    </motion.h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            "https://m.media-amazon.com/images/I/61PDVrPg6eL._AC_UY1000_.jpg",
                            "https://m.media-amazon.com/images/I/71ZPemLN84L._AC_UY1000_.jpg",
                            "https://m.media-amazon.com/images/I/61u-9+qC0tL._AC_UY1000_.jpg",
                            "https://www.findlayrowedesigns.com/cdn/shop/articles/Susan_Shaw_Jewelry_From_Findlay_Rowe_2000x.jpg?v=1699020981",
                            "https://i.etsystatic.com/11281866/r/il/ab5eae/6357675511/il_fullxfull.6357675511_igfw.jpg",
                            "https://s.alicdn.com/@img/imgextra/i4/6000000000367/O1CN01n6Voif1Ea8JHhuOJT_!!6000000000367-0-tbvideo.jpg_720x720q50.jpg",
                            "https://i.etsystatic.com/11281866/r/il/176f50/5910621766/il_570xN.5910621766_3154.jpg",
                            "https://i.etsystatic.com/48714312/r/il/9195fb/5991744687/il_340x270.5991744687_1z98.jpg",
                        ].map((src, i) => (
                            <motion.div
                                key={i}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={galleryVariants}
                                whileHover={{ scale: 1.1, y: -12 }}
                                className="relative overflow-hidden rounded-3xl shadow-2xl group cursor-pointer"
                            >
                                <img
                                    src={src}
                                    alt={`Koleksi emas Fajar Gold ${i + 1}`}
                                    className="w-full h-72 object-cover transition-transform duration-1000 group-hover:scale-120"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-6">
                                    <p className="text-white font-bold text-lg drop-shadow-lg">
                                        ✨ Emas 24K Premium
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Lokasi Toko */}
                <motion.div
                    initial={{ y: 60, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9 }}
                    className="bg-gradient-to-r from-amber-100/80 to-yellow-100/80 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-3xl p-12 text-center shadow-2xl border border-amber-200 dark:border-yellow-700/50 backdrop-blur-sm"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                    >
                        <MapPin className="w-16 h-16 text-amber-600 dark:text-yellow-400 mx-auto mb-6" />
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">
                        Kunjungi Toko Kami di Bandung
                    </h2>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                        Jl. Ahmad Yani No. 197, Bandung
                    </p>
                    <p className="text-base text-gray-700 dark:text-gray-400 mb-10 leading-relaxed">
                        Senin - Minggu: 09:00 - 18:00 WIB<br />
                        Telp: +62 22 1234 5678 | Email: info@fajargold.com
                    </p>
                    <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/kontak"
                            className="inline-block px-10 py-5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-500 dark:to-yellow-500 text-white font-bold text-xl shadow-2xl hover:shadow-yellow-500/50 transition-all duration-500"
                        >
                            Hubungi Kami Sekarang
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            <Footer />
            <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </motion.div>
    );
}