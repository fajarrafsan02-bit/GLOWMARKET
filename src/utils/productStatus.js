export const STATUS_PRODUK = {
    TERSEDIA: "TERSEDIA",
    TIDAK_TERSEDIA: "TIDAK_TERSEDIA",
    HABIS: "HABIS",
};

/**
 * Menyelaraskan status dengan stok yang tersisa.
 *
 * Cerminan dari aturan yang sama di ProdukService.statusMenurutStok pada
 * backend, supaya form tidak menampilkan status yang akan ditolak server.
 *
 * TIDAK_TERSEDIA dipertahankan apa adanya karena itu keputusan admin untuk
 * menyembunyikan produk, terlepas dari berapa pun stoknya.
 */
export function statusMenurutStok(stok, diminta) {
    const status = diminta || STATUS_PRODUK.TERSEDIA;

    if (status === STATUS_PRODUK.TIDAK_TERSEDIA) {
        return status;
    }

    const jumlah = Number(stok);
    return !Number.isFinite(jumlah) || jumlah <= 0
        ? STATUS_PRODUK.HABIS
        : STATUS_PRODUK.TERSEDIA;
}
