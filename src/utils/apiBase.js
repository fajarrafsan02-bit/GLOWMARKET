/**
 * Alamat dasar backend.
 *
 * Kosong saat pengembangan supaya request tetap relatif dan ditangani proxy
 * Vite (frontend & backend tampak satu origin — syarat agar cookie httpOnly
 * ikut terkirim). Di produksi frontend dan backend berbeda domain, jadi
 * alamatnya harus disebut penuh lewat VITE_API_URL.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || "";

/** Endpoint SockJS untuk koneksi STOMP. */
export const WS_URL = `${API_BASE_URL}/ws`;
