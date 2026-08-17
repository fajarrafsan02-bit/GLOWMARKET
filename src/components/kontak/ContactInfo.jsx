/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

import useStoreSettings from "../../hooks/useStoreSettings.js";

const buildContactInfo = (store) => [
    {
        icon: MapPin,
        title: "Alamat Toko",
        content: store.address,
    },
    {
        icon: Clock,
        title: "Jam Buka",
        content: "Senin - Minggu: 09:00 - 18:00 WIB",
    },
    {
        icon: Phone,
        title: "Telepon / WhatsApp",
        content: store.whatsapp ? `${store.phone} / ${store.whatsapp}` : store.phone,
    },
    {
        icon: Mail,
        title: "Email",
        content: store.email,
    },
];

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

export default function ContactInfo() {
    const store = useStoreSettings();
    const contactInfo = buildContactInfo(store);

    return (
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
                {contactInfo.map((item, i) => (
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
    );
}
