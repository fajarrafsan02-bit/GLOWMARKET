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
 * Endpoint SockJS untuk koneksi STOMP.
 *
 * Wajib relatif, sama seperti API. Server mengautentikasi WebSocket lewat
 * cookie yang dibaca saat handshake (lihat WsHandshakeInterceptor), dan
 * cookie itu tersimpan atas nama domain frontend karena seluruh panggilan
 * API melewati proxy. Menghubungi backend langsung membuat browser tidak
 * menyertakan cookie tersebut, sehingga handshake selalu ditolak.
 *
 * Upgrade WebSocket sendiri tidak diteruskan proxy, tetapi SockJS otomatis
 * turun ke transport berbasis HTTP yang tetap berjalan melewatinya.
 */
export const WS_URL = `${API_BASE_URL}/ws`;
