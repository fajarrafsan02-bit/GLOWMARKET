/**
 * Alamat dasar backend.
 *
 * Dibiarkan kosong (relatif) baik saat pengembangan maupun produksi, karena
 * keduanya sama-sama memakai proxy: Vite di lokal, rewrite Vercel di produksi
 * (lihat vercel.json). Efeknya browser melihat frontend dan backend berada di
 * satu origin, sehingga cookie httpOnly ikut terkirim tanpa perlu
 * SameSite=None — atribut yang kerap ditolak Safari dan mode privasi Chrome.
 *
 * VITE_API_URL hanya perlu diisi bila sengaja ingin memanggil backend secara
 * lintas domain tanpa proxy; dalam mode itu cookie menuntut SameSite=None
 * dan Secure=true di sisi server.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || "";

/**
 * Alamat backend khusus untuk WebSocket.
 *
 * Berbeda dari API biasa, koneksi ini TIDAK boleh lewat rewrite Vercel.
 * Rewrite hanya meneruskan HTTP biasa: upgrade WebSocket ditolak, dan
 * transport cadangan SockJS pun gagal karena rewrite mengubah metodenya
 * menjadi GET (muncul sebagai rentetan 405 Method Not Allowed) lalu
 * mengembalikan index.html sehingga SockJS mencoba mengurainya sebagai
 * JavaScript.
 *
 * Alamat penuh dipakai bila tersedia. Server sudah mendaftarkan origin ini
 * pada endpoint /ws, dan cookie autentikasi ikut terkirim saat handshake
 * karena atributnya SameSite=None; Secure.
 *
 * Saat pengembangan nilainya dibiarkan kosong supaya proxy Vite — yang
 * memang mendukung upgrade WebSocket — tetap yang menangani.
 */
const WS_BAWAAN_PRODUKSI = "https://rest-api-glowmarket.onrender.com";

export const WS_BASE_URL =
    import.meta.env.VITE_WS_URL ||
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? WS_BAWAAN_PRODUKSI : "");

/** Endpoint SockJS untuk koneksi STOMP. */
export const WS_URL = `${WS_BASE_URL}/ws`;
