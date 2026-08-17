import { formatPrice } from "../../utils/format.js";

export default function ProductDetailVariants({ variants, selectedVariantId, onSelect }) {
    return (
        <div className="mt-6">
            <p className="text-[10px] uppercase tracking-[0.18em] font-medium text-gray-400">
                Pilihan
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((v) => {
                    const active = v.id === selectedVariantId;

                    const habis = (v.stock ?? 0) <= 0;

                    return (
                        <button
                            key={v.id}
                            type="button"
                            disabled={habis}
                            onClick={() => onSelect(v.id)}
                            className={` px-4 py-2.5 text-xs font-medium border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                                active
                                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                                    : "bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white"
                            } `}
                        >
                            {v.nama}
                            <span
                                className={` ml-1.5 text-[10px] ${
                                    active
                                        ? "text-white/70 dark:text-gray-500"
                                        : "text-gray-400"
                                } `}
                            >
                                {formatPrice(v.harga)}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
