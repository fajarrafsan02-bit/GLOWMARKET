export default function ProductModalVariants({ variants, selectedVariantId, onSelectVariant, formatPrice }) {
    return (
        <div className="mt-3 sm:mt-5">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-gray-400">Pilihan</p>

            <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                {variants.map((v) => {
                    const active = v.id === selectedVariantId;
                    const habis = (v.stock ?? 0) <= 0;

                    return (
                        <button
                            key={v.id}
                            type="button"
                            disabled={habis}
                            onClick={() => onSelectVariant(v.id)}
                            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-medium rounded-md border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                                active
                                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                                    : "bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white"
                            }`}
                        >
                            {v.nama}
                            <span
                                className={`ml-1 text-[10px] ${
                                    active ? "text-white/70 dark:text-gray-500" : "text-gray-400"
                                }`}
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
