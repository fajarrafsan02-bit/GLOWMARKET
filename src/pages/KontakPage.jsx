/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import ContactHero from "../components/kontak/ContactHero.jsx";
import ContactInfo from "../components/kontak/ContactInfo.jsx";
import ContactForm from "../components/kontak/ContactForm.jsx";
import ContactMap from "../components/kontak/ContactMap.jsx";
import ContactGallery from "../components/kontak/ContactGallery.jsx";

export default function Kontak() {
    const [showAuth, setShowAuth] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white dark:from-black dark:to-gray-950 overflow-x-hidden transition-all duration-700"
        >
            <Header setShowAuth={setShowAuth} />

            {/* Hero Section - Mewah dengan overlay gelap di dark mode */}
            <ContactHero />

            <div className="max-w-5xl mx-auto px-4 py-16">
                {/* Informasi Kontak & Form */}
                <div className="grid md:grid-cols-2 gap-12 mb-20 items-start">
                    <ContactInfo />
                    <ContactForm />
                </div>

                {/* Peta Lokasi */}
                <ContactMap />

                {/* Galeri Toko */}
                <ContactGallery />
            </div>

            <Footer />
            <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </motion.div>
    );
}
