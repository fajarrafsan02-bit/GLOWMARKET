import { Upload, Image as ImageIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

import { SectionLabel } from "./formControls.jsx";
import { MAX_PRODUCT_IMAGES } from "../../utils/productImages.js";

export default function ProductImageField({
    form,
    loading,
    uploading,
    onImageChange,
    onRemoveImage,
    onMoveImage,
}) {
    const images = Array.isArray(form.gambarList) ? form.gambarList : [];
    const canAdd = images.length < MAX_PRODUCT_IMAGES;

    return (
        <div>
            <SectionLabel>Foto Produk</SectionLabel>

            <p className="mt-1 text-[11px] text-gray-400">
                Hingga {MAX_PRODUCT_IMAGES} foto. Foto pertama menjadi foto utama di katalog.
            </p>

            {images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {images.map((url, index) => (
                        <div
                            key={`${url}-${index}`}
                            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                        >
                            <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />

                            {index === 0 && (
                                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-amber-500 text-[9px] font-semibold uppercase tracking-wide text-white">
                                    Utama
                                </span>
                            )}

                            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 p-1 bg-black/45">
                                <button
                                    type="button"
                                    onClick={() => onMoveImage(index, -1)}
                                    disabled={index === 0 || loading}
                                    className="w-7 h-7 flex items-center justify-center rounded bg-white/90 text-gray-700 disabled:opacity-30"
                                    aria-label="Geser ke kiri"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onRemoveImage(index)}
                                    disabled={loading}
                                    className="w-7 h-7 flex items-center justify-center rounded bg-white/90 text-red-600 disabled:opacity-30"
                                    aria-label="Hapus foto"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onMoveImage(index, 1)}
                                    disabled={index === images.length - 1 || loading}
                                    className="w-7 h-7 flex items-center justify-center rounded bg-white/90 text-gray-700 disabled:opacity-30"
                                    aria-label="Geser ke kanan"
                                >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {images.length === 0 && (
                <div className="mt-3 w-full sm:w-40 aspect-square rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
                        <ImageIcon className="w-7 h-7" />
                        <span className="mt-2 text-[10px]">Belum ada gambar</span>
                    </div>
                </div>
            )}

            <div className="mt-3">
                <label
                    className={`relative block rounded-lg border border-dashed border-gray-300 dark:border-gray-700 transition ${
                        canAdd && !loading && !uploading
                            ? "cursor-pointer hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50/40 dark:hover:bg-amber-900/10"
                            : "opacity-60 cursor-not-allowed"
                    }`}
                >
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        multiple
                        onChange={onImageChange}
                        disabled={loading || uploading || !canAdd}
                        className="sr-only"
                    />

                    <div className="p-5 text-center">
                        <Upload className="w-5 h-5 mx-auto text-gray-400" />

                        <p className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                            {uploading
                                ? "Mengunggah gambar..."
                                : canAdd
                                  ? "Klik untuk menambah gambar"
                                  : `Maksimal ${MAX_PRODUCT_IMAGES} gambar`}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                            PNG, JPG, WEBP • Maks. 5 MB • {images.length}/{MAX_PRODUCT_IMAGES}
                        </p>
                    </div>
                </label>
            </div>
        </div>
    );
}
