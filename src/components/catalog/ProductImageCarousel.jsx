import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import useImageSwipe from "../../hooks/useImageSwipe.js";
import { isRemoteImage } from "../../utils/productImages.js";

export default function ProductImageCarousel({ images = [], alt = "Produk" }) {
    const urls = images.filter(isRemoteImage);
    const kunciFoto = urls.join("|");

    const [index, setIndex] = useState(0);

    /* Ganti produk berarti mulai lagi dari foto pertama. Penyetelan ulang
       dilakukan saat render — bukan lewat efek — supaya tidak ada satu frame
       pun yang sempat menampilkan foto lama dengan nomor urut foto baru. */
    const [kunciTerakhir, setKunciTerakhir] = useState(kunciFoto);
    if (kunciTerakhir !== kunciFoto) {
        setKunciTerakhir(kunciFoto);
        setIndex(0);
    }

    const count = urls.length;
    const safeIndex = Math.min(index, Math.max(count - 1, 0));
    const current = urls[safeIndex];
    const many = count > 1;
    const label = many ? `Foto ${safeIndex + 1} dari ${count}` : alt;

    const go = (next, event) => {
        event?.stopPropagation();
        if (!many) return;
        setIndex((prev) => (prev + next + count) % count);
    };

    const { onTouchStart, onTouchEnd, onClickCapture } = useImageSwipe({
        enabled: many,
        onSwipe: go,
    });

    const onKeyDown = (event) => {
        if (!many) return;
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            go(-1, event);
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            go(1, event);
        }
    };

    return (
        <div
            className="absolute inset-0"
            role={many ? "region" : undefined}
            aria-roledescription={many ? "carousel" : undefined}
            aria-label={alt}
            tabIndex={many ? 0 : undefined}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClickCapture={onClickCapture}
            onKeyDown={onKeyDown}
        >
            {current ? (
                <img
                    src={current}
                    alt={alt}
                    loading="lazy"
                    className="w-full h-full object-contain p-3 sm:p-4 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
                    <span className="text-5xl opacity-10">💍</span>
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
                        onClick={(event) => go(-1, event)}
                        className="absolute left-1.5 top-1/2 z-10 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 dark:bg-black/70 text-gray-800 dark:text-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        aria-label="Foto berikutnya"
                        onClick={(event) => go(1, event)}
                        className="absolute right-1.5 top-1/2 z-10 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 dark:bg-black/70 text-gray-800 dark:text-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center gap-0.5 pointer-events-auto">
                        {urls.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                aria-label={`Foto ${i + 1} dari ${count}`}
                                aria-current={i === safeIndex ? "true" : undefined}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setIndex(i);
                                }}
                                className="min-w-11 min-h-11 flex items-center justify-center"
                            >
                                <span
                                    className={`block h-1.5 rounded-full transition-all ${
                                        i === safeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
