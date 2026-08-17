/**
 * Satu sumber daftar kategori produk.
 *
 * Dipakai form admin (saat menyimpan kategori) dan halaman katalog
 * (saat memfilter), supaya keduanya tidak pernah berbeda.
 */
export const PRODUCT_CATEGORIES = ["Anting", "Cincin", "Kalung", "Gelang", "Liontin", "Setelan"];

export const KARAT_OPTIONS = [
    { value: "Semua", label: "Semua Karat" },
    { value: "24K", label: "24K" },
    { value: "22K", label: "22K" },
    { value: "18K", label: "18K" },
    { value: "14K", label: "14K" },
];

export default PRODUCT_CATEGORIES;
