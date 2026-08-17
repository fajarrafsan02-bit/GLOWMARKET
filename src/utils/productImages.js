export const MAX_PRODUCT_IMAGES = 8;

export function getProductImages(product) {
    if (!product) return [];

    const fromList = Array.isArray(product.gambarList)
        ? product.gambarList.filter((url) => typeof url === "string" && url.trim())
        : [];

    const cover = typeof product.gambar === "string" ? product.gambar.trim() : "";

    const unique = [];
    for (const url of [...(cover ? [cover] : []), ...fromList]) {
        if (url && !unique.includes(url)) unique.push(url);
    }

    return unique.slice(0, MAX_PRODUCT_IMAGES);
}

export function isRemoteImage(url) {
    return typeof url === "string" && (url.startsWith("http") || url.startsWith("data:"));
}
