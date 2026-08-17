<div align="center">

# GlowMarket — Frontend

**Antarmuka web toko perhiasan emas.**
Katalog, checkout, pembayaran, chat real-time, dan dashboard admin dalam satu SPA.

<br>

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Router](https://img.shields.io/badge/React_Router-7.10-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![STOMP](https://img.shields.io/badge/WebSocket-STOMP-010101?style=flat-square&logo=socketdotio&logoColor=white)

<br>

`410 modul` · `27 halaman` · `42 hook` · `316 komponen` · `15 utilitas`

</div>

---

## Daftar Isi

| | |
|---|---|
| **Memulai** | [Teknologi](#teknologi) · [Instalasi](#instalasi) · [Perintah](#perintah) · [Environment](#environment) |
| **Arsitektur** | [Struktur](#struktur-proyek) · [Filosofi](#filosofi-arsitektur) · [Routing](#routing--proteksi-rute) · [Autentikasi](#autentikasi) |
| **Referensi** | [Halaman](#peta-halaman) · [Hook](#katalog-hook) · [Utilitas](#utilitas) · [Event Bus](#event-bus-internal) |
| **Integrasi** | [API](#komunikasi-api) · [WebSocket](#websocket) · [Google Login](#login-google) |
| **Praktik** | [Konvensi Kode](#konvensi-kode) · [Jebakan ESLint](#jebakan-eslint) · [Build & Deploy](#build--deployment) · [Catatan Teknis](#catatan-teknis) |

---

## Teknologi

| Kategori | Paket | Versi | Peran |
|---|---|---|---|
| **Core** | react · react-dom | 19.2 | UI runtime |
| | vite | 7.2 | Dev server & bundler |
| | @vitejs/plugin-react-swc | 4.2 | Kompilasi JSX via SWC |
| **Routing** | react-router-dom | 7.10 | Navigasi SPA |
| **Styling** | tailwindcss + @tailwindcss/vite | 4.1 | Utility-first CSS |
| **Animasi** | framer-motion | 12.23 | Transisi & gesture |
| **Ikon** | lucide-react | 0.556 | Set ikon SVG |
| **HTTP** | axios | 1.13 | Klien API + interceptor |
| **Real-time** | @stomp/stompjs · sockjs-client | 7.2 · 1.6 | WebSocket STOMP |
| **Grafik** | chart.js · react-chartjs-2 | 4.5 · 5.3 | Visualisasi laporan |
| **Dokumen** | jspdf · html2canvas | 3.0 · 1.4 | Ekspor invoice PDF |
| **Efek** | canvas-confetti | 1.9 | Perayaan pembayaran sukses |
| **Kualitas** | eslint + react-hooks + react-refresh | 9.39 | Linting |

> **Tailwind v4** — tidak ada `tailwind.config.js`. Konfigurasi berada di
> `src/index.css` lewat `@import "tailwindcss"`.

---

## Instalasi

```bash
# 1. Install dependency (proyek memakai pnpm — lihat pnpm-lock.yaml)
pnpm install

# 2. Siapkan environment
cp .env.example .env
# isi VITE_GOOGLE_CLIENT_ID bila ingin mengaktifkan Login Google

# 3. Pastikan backend berjalan di http://localhost:8080

# 4. Jalankan
pnpm dev
```

Aplikasi terbuka di **`http://localhost:5173`**.

---

## Perintah

| Perintah | Fungsi |
|---|---|
| `pnpm dev` | Dev server + HMR di port 5173 |
| `pnpm build` | Build produksi ke `dist/` |
| `pnpm preview` | Pratinjau hasil build |
| `pnpm lint` | Jalankan ESLint |

---

## Environment

Satu-satunya variabel yang dipakai. Semua harus berawalan `VITE_` agar terbaca Vite.

| Variabel | Wajib | Fungsi |
|---|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Opsional | OAuth Client ID Google. **Harus sama persis** dengan `google.oauth.client-id` di backend. Bila kosong, tombol Login Google otomatis disembunyikan tanpa merusak form login biasa. |

Berkas `.env` di-`.gitignore`; `.env.example` menjadi templat yang ikut ke repo.

### Proxy dev server

`vite.config.js` memproksikan request ke backend agar frontend dan backend
**tampak satu origin** di mata browser — ini syarat mutlak agar cookie
autentikasi `httpOnly` dengan `SameSite=Lax` ikut terkirim.

```
/auth    → http://localhost:8080
/api     → http://localhost:8080
/uploads → http://localhost:8080
/ws      → http://localhost:8080   (WebSocket upgrade aktif)
```

---

## Struktur Proyek

```
src/
├── api/
│   └── Axios.jsx              Instance axios + auto-refresh token pada 401
│
├── context/
│   └── AuthContext.jsx        Sumber tunggal status login seluruh aplikasi
│
├── hooks/                     42 hook — seluruh logika data & state
│   ├── useKatalog.js          Katalog: filter, sort, paginasi, wishlist
│   ├── useCheckout.js         Checkout: alamat, ongkir, voucher, invoice
│   ├── useHeaderData.js       Badge keranjang/wishlist/chat + notifikasi live
│   └── ...
│
├── components/                316 komponen presentasional
│   ├── guards/                RequireAuth · RequireAdmin · RedirectAdminHome
│   ├── auth/                  Modal login/daftar/OTP + tombol Google
│   ├── catalog/               Kartu produk, filter, paginasi, quick view
│   ├── productdetail/         Galeri, varian, ulasan, produk terkait
│   ├── checkout/              Alamat, metode bayar, ringkasan pesanan
│   ├── header/ · footer/      Kerangka tata letak publik
│   ├── adminlayout/ · adminheader/   Kerangka tata letak admin
│   └── admin*/                Modul per fitur admin
│
├── pages/                     27 halaman = satu rute
│   └── userprofile/           Sub-bagian halaman profil
│
├── utils/                     15 modul murni, tanpa state
│   ├── format.js              Rupiah, tanggal, konversi angka
│   ├── productImages.js       Normalisasi daftar gambar produk
│   ├── orderStatus.js         Metadata status pesanan (label, warna, ikon)
│   └── ...
│
├── index.css                  Tailwind + animasi kustom
└── main.jsx                   Entry point + definisi seluruh rute
```

### Konvensi penamaan folder komponen

| Pola | Arti | Contoh |
|---|---|---|
| `components/<fitur>/` | Komponen milik satu halaman | `checkout/`, `poin/` |
| `components/<fitur>/<sub>/` | Pecahan dari komponen besar | `catalog/filters/`, `pesanan/reviewmodal/` |
| `components/admin<fitur>/` | Area admin | `adminorders/`, `adminakuntansi/` |

---

## Filosofi Arsitektur

Tiga aturan yang dipegang konsisten di seluruh basis kode:

### 1 · Logika di hook, tampilan di komponen

Komponen idealnya hanya menerima props lalu merender. Semua `useState`,
`useEffect`, panggilan API, dan aturan bisnis hidup di custom hook.

```jsx
// pages/KatalogPage.jsx — halaman hanya merangkai
export default function Katalog() {
    const { currentItems, addToCart, toggleWishlist, ... } = useKatalog();
    return <ProductCard p={item} onAddToCart={addToCart} ... />;
}
```

**Alasannya:** logika bisa diuji dan dipakai ulang tanpa menyentuh DOM, dan
halaman tetap terbaca sebagai rangkaian komponen — bukan gumpalan `useEffect`.

### 2 · Berkas kecil, satu tanggung jawab

Ketika sebuah komponen tumbuh melewati ~300 baris, ia dipecah ke subfolder.
Jejak refactor ini terlihat di seluruh proyek:

| Sebelum | Sesudah |
|---|---|
| `NeracaPanel.jsx` (361 baris) | hook `useNeracaData` + 5 komponen di `neraca/` |
| `PoinPage.jsx` (335 baris) | hook `usePoinPage` + 6 komponen di `poin/` |
| `OrderStatusModal.jsx` (326 baris) | util `orderStatus.js` + 8 komponen di `statusmodal/` |
| `Footer.jsx` (307 baris) | 5 komponen + data `footerLinks.js` |

### 3 · Perhitungan uang & aturan bisnis milik server

Frontend **tidak pernah** menghitung sendiri nilai yang berdampak finansial.
Diskon voucher, ongkir, dan total akhir selalu datang dari backend; frontend
hanya mengirim kode voucher dan menampilkan hasilnya. Ini mencegah manipulasi
nominal dari sisi klien.

---

## Routing & Proteksi Rute

Seluruh rute didefinisikan di `src/main.jsx` dan dijaga tiga guard berbeda.

### Peta guard

```
<AuthProvider>
  └── <Routes>
      ├── /admin/**                    → <RequireAdmin>
      │
      └── <RedirectAdminHome>          ← membungkus SEMUA rute customer
          ├── /, /katalog, /produk/:id, /tentang, /kontak   (publik)
          └── /keranjang, /checkout, /pesanan, /poin, ...   → <RequireAuth>
```

| Guard | Perilaku |
|---|---|
| **`RequireAuth`** | Menahan render dengan spinner selama status sesi belum pasti. Bila belum login → redirect ke `/` sambil membuka modal login dan mengingat halaman asal. |
| **`RequireAdmin`** | Sama seperti di atas, plus wajib `role === "ADMIN"`. |
| **`RedirectAdminHome`** | Layout-route tanpa spinner. Begitu diketahui pengguna adalah admin, langsung dilempar ke `/admin/dashboard`. Sengaja tidak menahan render agar halaman publik tetap tampil instan bagi pengunjung anonim. |

> **Kenapa `RedirectAdminHome` ada?**
> Dulu hanya `/admin/**` yang dijaga. Admin yang sesinya dipulihkan diam-diam
> lewat refresh token (bukan login manual) bisa tersangkut di halaman pembeli
> tanpa jalan keluar. Guard ini menutup celah tersebut.

### Daftar rute

<details>
<summary><b>Area Customer</b> — 17 rute</summary>

| Rute | Halaman | Akses |
|---|---|---|
| `/` | `UserHomePage` | Publik |
| `/katalog` | `KatalogPage` | Publik |
| `/produk/:id` | `ProductDetailPage` | Publik |
| `/tentang` | `TentangPage` | Publik |
| `/kontak` | `KontakPage` | Publik |
| `/payment-status/:externalId` | `PaymentStatusPage` | Publik |
| `/keranjang` | `KeranjangPage` | Login |
| `/wishlist` | `WishlistPage` | Login |
| `/checkout` | `CheckoutPage` | Login |
| `/payment` | `PaymentPage` | Login |
| `/payment-history` | `PaymentHistoryPage` | Login |
| `/pesanan` | `PesananPage` | Login |
| `/pesanan/:id` | `DetailPesananPage` | Login |
| `/profile` | `UserProfilePage` | Login |
| `/chat` | `UserChatPage` | Login |
| `/pengembalian` | `PengembalianPage` | Login |
| `/poin` | `PoinPage` | Login |

</details>

<details>
<summary><b>Area Admin</b> — 10 rute</summary>

| Rute | Halaman |
|---|---|
| `/admin/dashboard` | `AdminDashboardPage` |
| `/admin/products` | `AdminProductsPage` |
| `/admin/orders` | `AdminOrdersPage` |
| `/admin/pelanggan` | `AdminCustomersPage` |
| `/admin/laporan` | `AdminReportsPage` |
| `/admin/akuntansi` | `AdminAccountingPage` |
| `/admin/chat` | `AdminChatPage` |
| `/admin/settings` | `AdminSettingsPage` |
| `/admin/vouchers` | `AdminVouchersPage` |
| `/admin/pengembalian` | `AdminPengembalianPage` |

</details>

---

## Autentikasi

### Token tidak terlihat oleh JavaScript

Backend menyimpan JWT di cookie **`httpOnly`** — `document.cookie` tidak bisa
membacanya sama sekali, sehingga token kebal pencurian lewat XSS.

Konsekuensinya bagi frontend: **status login tidak bisa diketahui secara sinkron.**
Satu-satunya cara adalah bertanya ke server. Karena itu `AuthContext` punya
`loading` — sesuatu yang tidak dibutuhkan di era `localStorage`.

```jsx
const { user, isAuthenticated, isAdmin, loading, login, logout, refresh } = useAuth();
```

| Nilai | Isi |
|---|---|
| `user` | `{ id, namaLengkap, email, noHp, role }` atau `null` |
| `isAuthenticated` | `Boolean(user)` |
| `isAdmin` | `user?.role === "ADMIN"` |
| `loading` | `true` selama pemeriksaan sesi awal berlangsung |
| `login()` | Dipanggil setelah endpoint auth sukses; menyegarkan profil |
| `logout()` | Cabut sesi di server + bersihkan state lokal |

### Siklus hidup sesi

```
Aplikasi dimuat
   │
   ├─ localStorage "app_has_session" kosong?
   │     └→ lewati pemeriksaan  (pengunjung baru — tidak ada cookie untuk dicek)
   │
   └─ ada penanda sesi?
         └→ GET /api/user/profile
               ├─ 200 → user terisi
               └─ 401 → interceptor coba POST /auth/refresh
                          ├─ sukses → ulangi request semula
                          └─ gagal  → sesi dibersihkan, event auth:unauthorized
```

**Pemulihan otomatis** dipasang untuk dua kejadian: jaringan kembali `online`
dan tab kembali `visible`. Keduanya memicu `refresh()` agar sesi tidak tampak
hilang setelah laptop bangun dari sleep.

**Hanya 401 yang mengosongkan sesi.** Timeout, 5xx, atau jaringan putus sengaja
dibiarkan — cookie di browser masih valid, jadi menendang pengguna keluar akan
salah.

### Tiga alur masuk

| Alur | Langkah |
|---|---|
| **Pembeli** | Daftar → verifikasi email 6 digit → login |
| **Admin** | Login (email+password) → OTP 4 digit ke email → masuk |
| **Google** | Tombol Google → backend verifikasi ID token → masuk. **Bila akun berperan admin**, backend membalas `butuhOtpAdmin: true` dan modal berpindah ke layar OTP. |

---

## Peta Halaman

### Customer

| Halaman | Hook | Sorotan |
|---|---|---|
| **Beranda** | inline | Hero, kategori, 8 produk unggulan, quick view |
| **Katalog** | `useKatalog` | Filter kategori/karat, pencarian, sort, paginasi 12/halaman |
| **Detail Produk** | `useProductDetailPage` | Galeri swipe, varian, ulasan, **produk terkait** (kategori sama → karat sama) |
| **Keranjang** | `useKeranjang` | Ubah kuantitas, estimasi ongkir |
| **Checkout** | `useCheckout` | Pilih alamat, kurir, voucher, **pemilih metode bayar**, overlay redirect |
| **Status Bayar** | `usePaymentPage` | Polling status, sinkronisasi manual, konfeti saat lunas |
| **Pesanan** | `usePesanan` | Filter status, tulis ulasan, unduh invoice PDF |
| **Detail Pesanan** | `useOrderDetail` | Timeline pelacakan, rincian biaya |
| **Poin** | `usePoinPage` | Saldo, tukar voucher, **voucher tersedia**, riwayat |
| **Pengembalian** | `usePengembalian` | Form pengajuan + timeline status |
| **Chat** | `useUserChat` | Pesan real-time, balasan cepat, indikator online |
| **Profil** | `useUserProfile` | Data diri, alamat, wishlist, ulasan, riwayat bayar |

### Admin

| Halaman | Hook | Sorotan |
|---|---|---|
| **Dashboard** | `useDashboardData` | Kartu statistik, grafik penjualan, stok menipis |
| **Produk** | `useAdminProducts` | CRUD, varian, unggah multi-gambar, stok cepat |
| **Pesanan** | `useAdminOrders` | Ubah status + resi, majukan tahap pelacakan |
| **Pelanggan** | `useAdminCustomers` | Daftar, detail, aktif/nonaktifkan akun |
| **Laporan** | `useAdminReports` | Grafik, laporan harian, ekspor Excel |
| **Akuntansi** | `useAdminAccounting` | Jurnal, buku besar, laba rugi, neraca, beban, pembelian |
| **Voucher** | `useAdminVouchers` | CRUD voucher persen/nominal |
| **Chat** | `useAdminChat` | Inbox multi-percakapan, status online |
| **Pengembalian** | — | Setujui, tolak, terima barang |
| **Pengaturan** | `useOngkirSettings` | Profil toko, tarif ongkir, metode bayar, chatbot |

---

## Katalog Hook

<details>
<summary><b>Data & Domain</b> — 22 hook</summary>

| Hook | Tanggung jawab |
|---|---|
| `useKatalog` | Daftar produk, filter, sort, paginasi, wishlist, keranjang |
| `useProductDetailPage` | Satu produk + ulasan + produk terkait + rating terkait |
| `useProductDetailModal` | State varian & harga untuk quick view |
| `useKeranjang` | Isi keranjang, kuantitas, total |
| `useWishlist` | Daftar & toggle wishlist |
| `useCheckout` | Alamat, kurir, voucher, metode bayar, buat invoice |
| `usePaymentPage` | Polling & sinkronisasi status pembayaran |
| `usePesanan` | Riwayat pesanan + modal ulasan |
| `useOrderDetail` | Detail pesanan + timeline pelacakan |
| `usePoinPage` | Saldo poin, penukaran, voucher |
| `usePengembalian` | Pengajuan & riwayat retur |
| `useUserProfile` | Profil, alamat, wishlist, ulasan |
| `useAddressForm` · `useAddressSection` | Form alamat + kaskade wilayah |
| `useUserChat` | Chat pembeli |
| `useStoreSettings` | Pengaturan toko publik (nama, kontak, logo) |
| `useAdminProducts` · `useAdminOrders` · `useAdminCustomers` · `useAdminReports` · `useAdminAccounting` · `useAdminVouchers` · `useAdminChat` | Padanan untuk area admin |

</details>

<details>
<summary><b>UI & Infrastruktur</b> — 20 hook</summary>

| Hook | Tanggung jawab |
|---|---|
| `useAuthModal` | State modal login/daftar/OTP/Google |
| `useHeaderData` | Badge keranjang, wishlist, chat + notifikasi WebSocket |
| `useAdminNotifications` · `useAdminSidebar` | Kerangka admin |
| `useWebSocket` · `useWebSocketPresence` | Koneksi STOMP & status online |
| `useChartJsLoader` · `useSalesChart` · `useReportSalesChart` | Muat & render Chart.js |
| `useImageSwipe` | Gestur geser galeri |
| `useCatalogFilters` | State panel filter katalog |
| `useProductForm` · `useVoucherForm` · `usePembelianForm` · `useBebanPanel` · `useSaldoAwal` · `useOngkirSettings` · `useCustomerCard` | Form & panel admin |

</details>

---

## Utilitas

Modul murni tanpa state — aman diimpor dari mana saja.

| Berkas | Isi |
|---|---|
| `format.js` | `formatPrice` (Rupiah), `formatDate`, `formatDateTime`, `toMoney`, `formatThousand` |
| `productImages.js` | `getProductImages` (gabung cover + galeri, maks 8), `isRemoteImage` |
| `productCategory.js` | Daftar kategori & opsi karat |
| `orderStatus.js` · `orderTimeline.js` | Label, warna, ikon, dan tahapan status pesanan |
| `pengembalianStatus.js` · `pengembalianTimeline.js` | Padanan untuk retur |
| `paymentMethods.js` | Pengelompokan metode bayar Xendit + label |
| `paymentInvoice.js` | Susun data invoice untuk PDF |
| `cartItem.js` | Ambil nama/harga/gambar/berat item keranjang secara aman |
| `ongkir.js` · `customer.js` · `orderChat.js` · `chartConfig.js` | Pembantu domain masing-masing |
| `theme.js` | Tema — **saat ini dikunci ke mode terang** |

> **Catatan `format.js`** — `toMoney()` menerima `number` atau string BigDecimal
> dari API (`"3850000.00"`). Jangan diberi string yang sudah diformat
> (`"3.850.000"` atau `"Rp ..."`) karena hasilnya akan salah.

---

## Komunikasi API

### Instance axios

```js
// src/api/Axios.jsx
axios.create({
    baseURL: "/",           // proxy Vite meneruskan ke backend
    timeout: 30000,
    withCredentials: true,  // wajib: cookie httpOnly ikut terkirim
});
```

### Interceptor auto-refresh

Ketika sebuah request dibalas **401**:

```
401 diterima
  ├─ URL termasuk /auth/refresh, /auth/login, /auth/logout, ...?
  │    └→ teruskan error, jangan coba refresh (mencegah rekursi)
  │
  └─ selain itu
       └→ POST /auth/refresh  (di-dedupe: request bersamaan berbagi satu promise)
            ├─ sukses → ulangi request asli sekali (_retry)
            └─ gagal  → dispatch "auth:unauthorized" → AuthContext bersihkan sesi
```

Pesan galat dari backend (`data.message`, `data.error`, atau gabungan
`data.errors`) otomatis dinaikkan ke `err.message` supaya komponen cukup
menampilkan `err.message`.

### Bentuk respons backend

```json
{ "success": true, "message": "...", "data": { } }
```

Ambil selalu lewat `res.data?.data` dengan pengaman array:

```js
const list = Array.isArray(res.data?.data) ? res.data.data : [];
```

---

## WebSocket

Koneksi STOMP di atas SockJS ke endpoint **`/ws`**, dengan reconnect otomatis
tiap 5 detik dan heartbeat 4 detik.

| Topik | Dipakai oleh |
|---|---|
| `/topic/chat/user/{userId}` | Chat pembeli |
| `/topic/chat/admin/{adminId}` | Inbox admin |
| `/topic/notifications/user/{userId}` | Notifikasi pembeli |
| `/topic/admin/notifications` | Notifikasi admin |
| `/topic/user.presence` | Indikator online/offline |

```jsx
const { isConnected } = useWebSocket("/ws", `/topic/chat/user/${userId}`, (msg) => {
    setMessages((prev) => [...prev, msg]);
});
```

---

## Login Google

Memakai **Google Identity Services**; skrip GSI dimuat dinamis saat komponen
tombol dipasang.

```
GoogleLoginButton
   └─ Google merender tombolnya sendiri
        └─ callback menerima ID token (credential)
             └─ POST /auth/google { credential }
                  ├─ pembeli → sesi aktif, modal tertutup
                  └─ admin   → butuhOtpAdmin: true → modal pindah ke layar OTP
```

**Wajib sinkron di tiga tempat:**

1. `.env` frontend → `VITE_GOOGLE_CLIENT_ID`
2. `application-local.properties` backend → `google.oauth.client-id`
3. Google Cloud Console → **Authorized JavaScript origins** memuat
   `http://localhost:5173` (dan domain produksi)

Client Secret **tidak dipakai** pada alur ini dan tidak boleh disimpan di frontend.

---

## Event Bus Internal

Komunikasi lintas komponen yang jauh terpisah memakai `window` event —
lebih ringan daripada mengangkat state ke root hanya demi menyegarkan badge.

| Event | Dipancarkan saat | Didengarkan oleh |
|---|---|---|
| `cart:update` | Item keranjang berubah | `useHeaderData` (badge keranjang) |
| `wishlist:update` | Wishlist berubah | `useHeaderData` (badge wishlist) |
| `chat:read` · `chat:update` | Pesan dibaca / masuk | `useHeaderData` (badge chat) |
| `notification:update` | Notifikasi berubah | `useHeaderData` |
| `store-settings:update` | Admin menyimpan pengaturan | `useStoreSettings` |
| `auth:unauthorized` | Refresh token ditolak | `AuthContext` (bersihkan sesi) |
| `user:login` · `user:logout` | Sesi dimulai / diakhiri | Konsumen umum |
| `auth:open` | Permintaan membuka modal login | `Header` |
| `report:refresh` | Laporan minta dimuat ulang | Panel laporan admin |

> ⚠️ **Ketidakkonsistenan diketahui**
> `pages/UserHomePage.jsx` memancarkan **`cart:updated`** (berakhiran *d*),
> sementara seluruh berkas lain dan pendengarnya memakai **`cart:update`**.
> Akibatnya badge keranjang tidak menyegar setelah menambah produk dari beranda.
> Perbaikannya: samakan menjadi `cart:update`.

---

## Konvensi Kode

| Aspek | Aturan |
|---|---|
| **Bahasa** | Domain dalam bahasa Indonesia (`pesanan`, `keranjang`, `ongkir`), API React dalam bahasa Inggris |
| **Berkas komponen** | `PascalCase.jsx`, satu default export |
| **Berkas hook** | `useNamaHook.js`, default export |
| **Berkas utilitas** | `camelCase.js`, named export |
| **Impor** | Relatif dengan ekstensi eksplisit (`../utils/format.js`) — tidak ada alias path |
| **Komentar** | Menjelaskan **alasan**, bukan mengulang isi kode |
| **Styling** | Tailwind inline; tidak ada CSS module maupun styled-components |
| **Dark mode** | Kelas `dark:` tetap ditulis, meski tema saat ini dikunci terang |

### Alur menambah halaman baru

```
1. Buat hook           src/hooks/useFiturBaru.js       ← semua logika
2. Buat komponen       src/components/fiturbaru/*.jsx  ← tampilan
3. Buat halaman        src/pages/FiturBaruPage.jsx     ← rangkai keduanya
4. Daftarkan rute      src/main.jsx                    ← di dalam guard yang tepat
5. Verifikasi          pnpm lint && pnpm build
```

---

## Jebakan ESLint

Konfigurasi memakai `no-unused-vars` dengan `varsIgnorePattern: '^[A-Z_]'`.
Pola ini **hanya berlaku untuk deklarasi `const`/`let`**, bukan parameter
destructuring — dan itu menimbulkan dua jebakan yang sering muncul.

### Jebakan 1 · `motion` dari framer-motion

```jsx
// ❌ 'motion' dilaporkan tidak terpakai bila hanya muncul di JSX
import { motion } from "framer-motion";

// ✅ huruf kapital cocok dengan varsIgnorePattern
import { motion as Motion } from "framer-motion";
```

### Jebakan 2 · Komponen ikon lewat props

```jsx
// ❌ IconComponent adalah parameter destructuring — pola tidak menolongnya
function Card({ icon: IconComponent }) {
    return <IconComponent />;
}

// ✅ referensi dalam ekspresi non-JSX menandainya terpakai
function Card({ icon: IconComponent }) {
    return <>{IconComponent && <IconComponent />}</>;
}
```

### Peringatan yang sudah diketahui

`pnpm lint` menyisakan **3 error** dari aturan
`react-hooks/set-state-in-effect` di:

- `components/catalog/ProductImageCarousel.jsx:12`
- `components/productdetail/ProductImageGallery.jsx:13`
- `context/AuthContext.jsx:77`

Ketiganya berasal dari pola `setState` langsung di dalam `useEffect` untuk
mereset indeks galeri dan menyelesaikan pemeriksaan sesi. Bukan hasil perubahan
baru; anggap sebagai batas dasar (*baseline*) hingga diperbaiki tersendiri.

---

## Build & Deployment

```bash
pnpm build     # → dist/
pnpm preview   # verifikasi hasil build secara lokal
```

### Ukuran bundel

| Berkas | Mentah | Gzip |
|---|---|---|
| `index.js` | ~1,78 MB | ~486 KB |
| `index.css` | ~134 KB | ~19 KB |

> Vite memperingatkan chunk >500 KB. Optimasi lanjutan yang bisa ditempuh:
> `React.lazy` untuk memisahkan rute admin, dan `manualChunks` untuk memecah
> Chart.js serta jsPDF ke bundel terpisah.

### Checklist produksi

- [ ] `VITE_GOOGLE_CLIENT_ID` terisi dan cocok dengan backend
- [ ] Domain produksi terdaftar di **Authorized JavaScript origins** Google
- [ ] Backend menyajikan HTTPS (cookie `Secure` mensyaratkannya)
- [ ] `APP_CORS_ORIGINS` di backend memuat domain frontend
- [ ] Web server mengarahkan semua rute ke `index.html` (SPA fallback)
- [ ] `dist/` disajikan sebagai berkas statis; `/api`, `/auth`, `/ws`, `/uploads`
      diproksikan ke backend (proxy Vite hanya berlaku saat pengembangan)

Contoh Nginx:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location ~ ^/(api|auth|uploads) {
    proxy_pass http://backend:8080;
}

location /ws {
    proxy_pass http://backend:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

---

## Catatan Teknis

Kumpulan keputusan yang tidak terlihat jelas dari kode, namun penting dipahami
sebelum mengubahnya.

### 401 di konsol saat belum login itu normal

DevTools mencetak baris merah untuk **setiap** respons 4xx, terlepas dari apakah
JavaScript sudah menanganinya. `AuthContext` menangani 401 dengan benar
(pengguna dianggap belum login, halaman publik tetap jalan).

Frekuensinya sudah ditekan: pemeriksaan sesi awal **dilewati** bila
`localStorage.app_has_session` kosong, sehingga pengunjung baru tidak memicu
request yang pasti gagal. 401 masih akan muncul setelah logout atau ketika
cookie kedaluwarsa — itu tak terhindarkan.

### Redirect satu tab ke Xendit

Halaman checkout Xendit mengirim header `X-Frame-Options: SAMEORIGIN`, jadi
**tidak bisa disematkan dalam iframe**. Karena itu checkout memakai
`window.location.href` (tab yang sama), bukan `window.open`. Backend menyisipkan
`success_redirect_url` / `failure_redirect_url` agar pembeli otomatis kembali ke
`/payment-status/:externalId`.

Selama jeda menuju Xendit, `CheckoutRedirecting` menampilkan overlay layar penuh
supaya halaman tidak terlihat membeku.

### Data wilayah diproksikan lewat backend

Form alamat dulu memanggil `emsifa.com` dan `kodepos.vercel.app` langsung dari
browser, dan gagal `ERR_NAME_NOT_RESOLVED` pada sebagian jaringan pengguna.
Sekarang seluruhnya lewat `/api/wilayah/**` di backend. Bila sumber pihak ketiga
mati, backend mengembalikan daftar kosong — form tetap bisa diisi manual.

### Quick view dan halaman detail hidup berdampingan

Klik kartu produk membuka **modal quick view**. Tombol *"View full product
details"* di dalamnya barulah menuju **`/produk/:id`**. Halaman penuh juga
menjadi tujuan tautan dari wishlist, keranjang, dan tautan yang dibagikan.

Sebelumnya tautan-tautan itu mengarah ke rute yang belum pernah dibuat.

### Tema dikunci ke mode terang

`utils/theme.js` selalu mengembalikan `"light"` dan `toggle()` sengaja tidak
melakukan apa pun. Kelas `dark:` tetap dipertahankan di seluruh komponen agar
mode gelap bisa dihidupkan kembali hanya dengan mengubah berkas tersebut.

---

<div align="center">

**Dokumentasi backend:** [`../PROJEK_JAVA/DOCUMENTATION.md`](../PROJEK_JAVA/DOCUMENTATION.md)

</div>
