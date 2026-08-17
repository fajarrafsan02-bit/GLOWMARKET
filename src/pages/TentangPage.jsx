/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";

import AboutHero from "../components/tentang/AboutHero.jsx";
import AboutHistory from "../components/tentang/AboutHistory.jsx";
import AboutFeatures from "../components/tentang/AboutFeatures.jsx";
import AboutGallery from "../components/tentang/AboutGallery.jsx";
import AboutLocation from "../components/tentang/AboutLocation.jsx";

export default function Tentang() {
    const [showAuth, setShowAuth] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-linear-to-b from-amber-50/50 to-white dark:from-black dark:to-gray-950 overflow-x-hidden transition-all duration-700"
        >
            <Header setShowAuth={setShowAuth} />

            {/* Hero Section */}
            <AboutHero />

            <div className="max-w-5xl mx-auto px-4 py-16">
                {/* Sejarah Kami */}
                <AboutHistory />

                {/* Keunggulan Kami */}
                <AboutFeatures />

                {/* Galeri Koleksi */}
                <AboutGallery />

                {/* Lokasi Toko */}
                <AboutLocation />
            </div>

            <Footer />
            <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </motion.div>
    );
}
