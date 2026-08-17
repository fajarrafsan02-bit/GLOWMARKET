export default function ProductModalPrice({ displayPrice, formatPrice }) {
    return (
        <div className="mt-3 sm:mt-5">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-gray-400">Harga</p>

            <p className="mt-0.5 text-xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {formatPrice(displayPrice)}
            </p>

            <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500">
                Harga dapat berubah mengikuti harga emas.
            </p>
        </div>
    );
}
