import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import api from "../api/Axios.jsx"; // Import API
import { MapPin, Phone, Mail, Clock, MessageCircle, Sparkles, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Kontak() {
    console.log(motion);
    const [showAuth, setShowAuth] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            await api.post("/api/contact/send", formData);
            setStatus({ type: "success", message: "Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda." });
            setFormData({ name: "", email: "", phone: "", message: "" });
        } catch (error) {
            console.error("Gagal mengirim pesan:", error);
            setStatus({ type: "error", message: "Gagal mengirim pesan. Silakan coba lagi nanti." });
        } finally {
            setLoading(false);
            // Clear status after 5 seconds
            setTimeout(() => setStatus({ type: "", message: "" }), 5000);
        }
    };

    // Variants untuk stagger animation pada card kontak
    const contactVariants = {
        hidden: { y: 60, opacity: 0 },
        visible: (i) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: i * 0.15,
                duration: 0.8,
                type: "spring",
                stiffness: 80,
            },
        }),
    };

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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white dark:from-black dark:to-gray-950 overflow-x-hidden transition-all duration-700"
        >
            <Header setShowAuth={setShowAuth} />

            {/* Hero Section - Mewah dengan overlay gelap di dark mode */}
            <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, type: "spring" }}
                className="relative bg-gradient-to-r from-amber-600 to-yellow-700 dark:from-amber-700 dark:to-yellow-800 text-white py-24 overflow-hidden shadow-2xl"
            >
                <div className="absolute inset-0 opacity-40 dark:opacity-60">
                    <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Interior toko perhiasan emas mewah"
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
                        Hubungi Kami <Sparkles className="inline w-12 h-12 ml-4 animate-pulse" />
                    </motion.h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed"
                    >
                        Kami siap membantu Anda menemukan perhiasan emas impian.<br />
                        Kunjungi toko atau hubungi kami kapan saja!
                    </motion.p>
                </div>
            </motion.div>

            <div className="max-w-5xl mx-auto px-4 py-16">
                {/* Informasi Kontak & Form */}
                <div className="grid md:grid-cols-2 gap-12 mb-20 items-start">
                    {/* Informasi Kontak */}
                    <div>
                        <motion.h2
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-10"
                        >
                            Informasi Kontak
                        </motion.h2>

                        <div className="space-y-8">
                            {[
                                {
                                    icon: MapPin,
                                    title: "Alamat Toko",
                                    content: (
                                        <>
                                            Jl. Ahmad Yani No. 197<br />
                                            Bandung, Jawa Barat 40114<br />
                                            Indonesia
                                        </>
                                    ),
                                },
                                {
                                    icon: Clock,
                                    title: "Jam Buka",
                                    content: "Senin - Minggu: 09:00 - 18:00 WIB",
                                },
                                {
                                    icon: Phone,
                                    title: "Telepon / WhatsApp",
                                    content: "+62 22 1234 5678",
                                },
                                {
                                    icon: Mail,
                                    title: "Email",
                                    content: "info@fajargold.com",
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    custom={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={contactVariants}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="flex items-start gap-5 bg-white dark:bg-gray-900/95 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-7 border border-amber-100 dark:border-yellow-800/40 backdrop-blur-sm"
                                >
                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 dark:from-amber-500 dark:to-yellow-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <item.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {item.content}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Form Kontak */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-10">
                            Kirim Pesan
                        </h2>

                        <AnimatePresence>
                            {status.message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                                        status.type === 'success' 
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                    }`}
                                >
                                    {status.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                                    <p className="font-medium text-sm">{status.message}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900/95 rounded-3xl shadow-2xl p-10 space-y-6 border border-amber-100 dark:border-yellow-800/40 backdrop-blur-sm">
                            <div>
                                <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    Nama Lengkap
                                </label>
                                <motion.input
                                    whileFocus={{ scale: 1.02 }}
                                    type="text"
                                    name="namaLengkap"
                                    value={formData.namaLengkap}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/70 text-gray-900 dark:text-white focus:border-amber-500 dark:focus:border-yellow-500 focus:outline-none focus:ring-4 focus:ring-amber-300/30 dark:focus:ring-yellow-500/30 transition-all duration-300"
                                    placeholder="Masukkan nama Anda"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    Email
                                </label>
                                <motion.input
                                    whileFocus={{ scale: 1.02 }}
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/70 text-gray-900 dark:text-white focus:border-amber-500 dark:focus:border-yellow-500 focus:outline-none focus:ring-4 focus:ring-amber-300/30 dark:focus:ring-yellow-500/30 transition-all duration-300"
                                    placeholder="email@contoh.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    No. Telepon / WhatsApp
                                </label>
                                <motion.input
                                    whileFocus={{ scale: 1.02 }}
                                    type="tel"
                                    name="noTelepon"
                                    value={formData.noTelepon}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/70 text-gray-900 dark:text-white focus:border-amber-500 dark:focus:border-yellow-500 focus:outline-none focus:ring-4 focus:ring-amber-300/30 dark:focus:ring-yellow-500/30 transition-all duration-300"
                                    placeholder="+62 ..."
                                />
                            </div>
                            <div>
                                <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    Pesan
                                </label>
                                <motion.textarea
                                    whileFocus={{ scale: 1.02 }}
                                    rows="6"
                                    name="pesan"
                                    value={formData.pesan}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/70 text-gray-900 dark:text-white focus:border-amber-500 dark:focus:border-yellow-500 focus:outline-none focus:ring-4 focus:ring-amber-300/30 dark:focus:ring-yellow-500/30 transition-all duration-300 resize-none"
                                    placeholder="Tulis pertanyaan atau pesan Anda di sini..."
                                    required
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={loading}
                                className={`w-full py-5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-500 dark:to-yellow-500 text-white font-bold text-xl shadow-2xl hover:shadow-yellow-500/50 transition-all duration-500 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-6 h-6" />
                                        Kirim Pesan
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>

                {/* Peta Lokasi */}
                <motion.div
                    initial={{ y: 60, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9 }}
                    className="mb-20"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-10">
                        Lokasi Toko Kami
                    </h2>
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="rounded-3xl overflow-hidden shadow-2xl border-8 border-amber-200 dark:border-yellow-700/50"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798575290955!2d107.6290143147565!3d-6.917463995002444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6388e9441f3%3A0x1b5b1c8e8b8b8b8b!2sJl.%20Ahmad%20Yani%20No.197%2C%20Cicadas%2C%20Kec.%20Cibeunying%20Kidul%2C%20Kota%20Bandung%2C%20Jawa%20Barat%2040114!5e0!3m2!1sid!2sid!4v1700000000000"
                            width="100%"
                            height="500"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lokasi Fajar Gold di Google Maps"
                        />
                    </motion.div>
                </motion.div>

                {/* Galeri Toko */}
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
                        {[
                            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1573496791018-5f95c6c3e9a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1518998053901-4e1d2da9d329?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        ].map((src, i) => (
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
                                    alt={`Interior toko Fajar Gold ${i + 1}`}
                                    className="w-full h-80 object-cover transition-transform duration-700"
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <Footer />
            <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </motion.div>
    );
}