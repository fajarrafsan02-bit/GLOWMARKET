import { toMoney } from "./format.js";

export const getProduct = (item) => item.produk || item;

export const getQuantity = (item) => Number(item.jumlah ?? item.quantity ?? 1);

export const getProductPrice = (item) => toMoney(getProduct(item)?.harga ?? item.harga ?? 0);

export const getProductName = (item) =>
    getProduct(item)?.nama || item.nama || "Produk Emas";

export const getProductImage = (item) => getProduct(item)?.gambar || "";

export const getProductWeight = (item) =>
    getProduct(item)?.beratGram ??
    getProduct(item)?.berat ??
    item.beratGram ??
    item.berat ??
    null;

export const getPrice = (item) => getProductPrice(item);

export const getName = (item) => getProductName(item);

export const getImage = (item) => getProduct(item)?.gambar || "/placeholder.jpg";

export const getWeight = (item) => getProductWeight(item);

