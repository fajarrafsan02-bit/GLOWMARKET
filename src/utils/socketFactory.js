import SockJS from "sockjs-client";

import { WS_URL } from "./apiBase.js";

/**
 * Transport SockJS yang dipakai di produksi.
 *
 * Daftar ini sengaja dibatasi. Rewrite Vercel tidak meneruskan upgrade
 * WebSocket, sehingga percobaan "websocket" selalu gagal lebih dulu dan
 * memperlambat koneksi. Transport "jsonp" dan "iframe-*" juga dibuang karena
 * keduanya memuat dokumen HTML dari server — permintaan itu tidak cocok
 * dengan pola rewrite dan berakhir di index.html, yang lalu gagal diurai
 * sebagai JavaScript dan sempat membuat React Router mencatat rute palsu
 * seperti "/ws/iframe.html".
 *
 * Menyisakan xhr-streaming dan xhr-polling saja membuat koneksi langsung
 * memakai jalur yang memang bisa dilewati proxy.
 */
const TRANSPORT_LEWAT_PROXY = ["xhr-streaming", "xhr-polling"];

/**
 * Membuat koneksi SockJS ke endpoint STOMP.
 *
 * Dipakai bersama oleh seluruh hook realtime supaya pilihan transport tidak
 * tersebar dan berbeda-beda antar halaman.
 */
export default function buatSockJS() {
    if (import.meta.env.PROD) {
        return new SockJS(WS_URL, null, { transports: TRANSPORT_LEWAT_PROXY });
    }

    // Proxy Vite mendukung upgrade WebSocket, jadi biarkan SockJS memilih
    // transport tercepat saat pengembangan.
    return new SockJS(WS_URL);
}
