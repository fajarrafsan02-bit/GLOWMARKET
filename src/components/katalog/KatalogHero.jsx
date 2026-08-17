import { motion as Motion } from "framer-motion";
import { Diamond } from "lucide-react";

import useStoreSettings from "../../hooks/useStoreSettings.js";

export default function KatalogHero({ productCount }) {
    const store = useStoreSettings();

    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8 sm:mb-16 space-y-3"
        >
            <span className="inline-flex items-center gap-1.5 pl-3.5 pr-4 py-2 bg-amber-100 text-amber-700 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] border border-amber-200/60">
                <Diamond className="w-3 h-3 text-amber-500" />
                Katalog
            </span>

            <h1 className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                Koleksi Emas {store.name}
            </h1>

            <p className="text-xs xs:text-sm sm:text-base text-gray-500 font-light max-w-lg mx-auto leading-relaxed">
                {productCount} produk emas murni bersertifikat tersedia untuk Anda
            </p>
        </Motion.div>
    );
}
