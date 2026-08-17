import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion as Motion } from "framer-motion";

import useImageSwipe from "../../hooks/useImageSwipe.js";
import { getProductImages, isRemoteImage } from "../../utils/productImages.js";

export default function ProductImageGallery({ product, className = "" }) {
    const images = getProductImages(product).filter(isRemoteImage);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setIndex(0);
    }, [product?.id, images.join("|")]);

    const count = images.length;
    const safeIndex = Math.min(index, Math.max(count - 1, 0));
    const current = images[safeIndex];
    const many = count > 1;
    const label = many ? `Foto ${safeIndex + 1} dari ${count}` : product?.nama || "Produk";

    const go = (delta) => {
        if (!many) return;
        setIndex((prev) => (prev + delta + count) % count);
    };

    const { onTouchStart, onTouchEnd } = useImageSwipe({
        enabled: many,
        onSwipe: go,
    });

    const onKeyDown = (event) => {
        if (!many) return;
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            go(-1);
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            go(1);
        }
    };

    return (
        <div
            className={`relative w-full md:w-1/2 shrink-0 bg-[#f5f3ee] dark:bg-gray-900 h-44 xs:h-52 sm:h-64 md:h-auto md:min-h-[500px] overflow-hidden ${className}`}
            role={many ? "region" : undefined}
            aria-roledescription={many ? "carousel" : undefined}
            aria-label={product?.nama || "Galeri produk"}
            tabIndex={many ? 0 : undefined}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onKeyDown={onKeyDown}
        >
            {current ? (
                <Motion.img
                    key={current}
                    initial={{ scale: 1.03, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.45 }}
                    src={current}
                    alt={product?.nama || "Produk"}
                    className="absolute inset-0 w-full h-full object-contain p-2 sm:p-5"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl sm:text-8xl opacity-10">💍</span>
                </div>
            )}

            {product?.karatEmas && (
                <div className="absolute left-2.5 top-2.5 z-10 px-2 py-0.5 bg-white/90 dark:bg-black/80 backdrop-blur-sm text-[9px] uppercase tracking-[0.15em] font-semibold text-gray-800 dark:text-gray-200 rounded">
                    {product.karatEmas}K Gold
                </div>
            )}

            {many && (
                <>
                    <p className="sr-only" aria-live="polite">
                        {label}
                    </p>

                    <button
                        type="button"
                        aria-label="Foto sebelumnya"
                        onClick={() => go(-1)}
                        className="absolute left-1.5 top-1/2 z-20 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/80 dark:bg-black/70 text-gray-800 dark:text-gray-100 flex items-center justify-center shadow-sm"
                    >
                        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    <button
                        type="button"
                        aria-label="Foto berikutnya"
                        onClick={() => go(1)}
                        className="absolute right-1.5 top-1/2 z-20 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/80 dark:bg-black/70 text-gray-800 dark:text-gray-100 flex items-center justify-center shadow-sm"
                    >
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                </>
            )}

            <div className="absolute bottom-2 left-2.5 right-2.5 z-10">
                {many && (
                    <div
                        className="mb-1.5 flex gap-1.5 overflow-x-auto pb-0.5"
                        onTouchStart={(event) => event.stopPropagation()}
                        onTouchEnd={(event) => event.stopPropagation()}
                    >
                        {images.map((url, i) => (
                            <button
                                key={`${url}-${i}`}
                                type="button"
                                aria-label={`Foto ${i + 1} dari ${count}`}
                                aria-current={i === safeIndex ? "true" : undefined}
                                onClick={() => setIndex(i)}
                                className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden border-2 transition ${
                                    i === safeIndex
                                        ? "border-amber-400"
                                        : "border-white/40 hover:border-white/80"
                                }`}
                            >
                                <img src={url} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between text-white drop-shadow-sm">
                    <span className="text-[9px] uppercase tracking-[0.16em] text-white/80">
                        {many ? label : "GlowMarket Collection"}
                    </span>

                    <span className="text-[9px] uppercase tracking-[0.12em] text-white/80">
                        {product?.beratGram ? `${product.beratGram} gram` : "Jewelry"}
                    </span>
                </div>
            </div>
        </div>
    );
}
