import { useEffect, useState } from "react";

export default function useProductDetailModal({ product, onAddToCart }) {
    const variants = product?.varian || [];

    const [selectedVariantId, setSelectedVariantId] = useState(null);

    useEffect(() => {
        setSelectedVariantId(variants.length ? variants[0].id : null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?.id]);

    const selectedVariant = variants.find((v) => v.id === selectedVariantId) || null;

    const displayPrice = selectedVariant ? selectedVariant.harga : product?.harga;

    const displayStock = selectedVariant ? selectedVariant.stock : product?.stock;

    const hasVariants = variants.length > 0;

    const handleAddToCart = () => {
        onAddToCart(product, selectedVariant ? selectedVariant.id : null);
    };

    return {
        variants,
        selectedVariantId,
        setSelectedVariantId,
        selectedVariant,
        displayPrice,
        displayStock,
        hasVariants,
        handleAddToCart,
    };
}
