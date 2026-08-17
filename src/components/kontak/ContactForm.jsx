/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import api from "../../api/Axios.jsx";

const inputClass =
    "w-full px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/70 text-gray-900 dark:text-white focus:border-amber-500 dark:focus:border-yellow-500 focus:outline-none focus:ring-4 focus:ring-amber-300/30 dark:focus:ring-yellow-500/30 transition-all duration-300";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
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
            setStatus({
                type: "success",
                message: "Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.",
            });
            setFormData({ name: "", email: "", phone: "", message: "" });
        } catch (error) {
            console.error("Gagal mengirim pesan:", error);
            setStatus({ type: "error", message: "Gagal mengirim pesan. Silakan coba lagi nanti." });
        } finally {
            setLoading(false);
            setTimeout(() => setStatus({ type: "", message: "" }), 5000);
        }
    };

    return (
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
                        className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${status.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}
                    >
                        {status.type === "success" && (
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <p className="font-medium text-sm">{status.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-900/95 rounded-3xl shadow-2xl p-10 space-y-6 border border-amber-100 dark:border-yellow-800/40 backdrop-blur-sm"
            >
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
                        className={inputClass}
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
                        className={inputClass}
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
                        className={inputClass}
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
                        className={`${inputClass} resize-none`}
                        placeholder="Tulis pertanyaan atau pesan Anda di sini..."
                        required
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full py-5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-500 dark:to-yellow-500 text-white font-bold text-xl shadow-2xl hover:shadow-yellow-500/50 transition-all duration-500 flex items-center justify-center gap-3 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
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
    );
}
