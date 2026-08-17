export default function ProductModalDescription({ product }) {
    if (!product.deskripsi) {
        return null;
    }

    return (
        <div className="mt-3 sm:mt-5">
            <h3 className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-semibold text-gray-400">
                About This Piece
            </h3>

            <p className="mt-1 text-xs sm:text-sm leading-5 text-gray-500 dark:text-gray-400">
                {product.deskripsi}
            </p>
        </div>
    );
}
