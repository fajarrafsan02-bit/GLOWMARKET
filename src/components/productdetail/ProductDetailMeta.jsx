export default function ProductDetailMeta({ product }) {
    return (
        <div className="mt-3 sm:mt-5 grid grid-cols-2 border-y border-gray-200 dark:border-gray-800">
            <div className="py-2.5 pr-2.5 border-r border-gray-200 dark:border-gray-800">
                <p className="text-[9px] uppercase tracking-[0.15em] text-gray-400">Gold</p>

                <p className="mt-0.5 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200">
                    {product.karatEmas ? `${product.karatEmas}K` : "-"}
                </p>
            </div>

            <div className="py-2.5 pl-2.5">
                <p className="text-[9px] uppercase tracking-[0.15em] text-gray-400">Weight</p>

                <p className="mt-0.5 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200">
                    {product.beratGram ? `${product.beratGram} gram` : "-"}
                </p>
            </div>
        </div>
    );
}
