# 🏆 Fajar Gold - E-Commerce Toko Emas

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://stomp-js.github.io/stomp-websocket/)

> **Aplikasi e-commerce modern untuk toko emas dengan fitur real-time chat, dashboard admin interaktif, dan sistem pembayaran terintegrasi.**

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Struktur Direktori](#-struktur-direktori)
- [Prerequisites](#-prerequisites)
- [Instalasi](#-instalasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Build Production](#-build-production)
- [Fitur Detail](#-fitur-detail)
- [API Integration](#-api-integration)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 📖 Tentang Proyek

**Fajar Gold** adalah platform e-commerce modern yang dikhususkan untuk penjualan produk emas berkualitas tinggi. Aplikasi ini dibangun dengan teknologi terkini untuk memberikan pengalaman belanja yang seamless, aman, dan interaktif.

### Mengapa Fajar Gold?

- ✅ **Real-time Communication** - Chat langsung dengan admin menggunakan WebSocket
- ✅ **Modern UI/UX** - Interface yang cantik dan responsif dengan Tailwind CSS
- ✅ **Secure Payment** - Integrasi dengan Xendit untuk pembayaran yang aman
- ✅ **Admin Dashboard** - Dashboard yang powerful untuk manajemen toko
- ✅ **Dark Mode** - Dukungan tema gelap untuk kenyamanan mata
- ✅ **Mobile Responsive** - Optimized untuk semua ukuran layar

---

## ✨ Fitur Utama

### 🛍️ Fitur Customer

#### 1. **Katalog Produk Lengkap**
- 📂 Filter berdasarkan 7 kategori: Semua, Anting, Cincin, Kalung, Gelang, Liontin, Setelan
- 🔍 Real-time search berdasarkan nama produk
- 🔄 5 opsi sorting:
  - 🆕 Terbaru (default)
  - 💰 Harga: Terendah → Tertinggi
  - 💎 Harga: Tertinggi → Terendah
  - ⚖️ Karat: Terendah → Tertinggi
  - ✨ Karat: Tertinggi → Terendah
- 📄 Pagination dengan 12 produk per halaman
- 📱 Responsive filter menu untuk mobile

#### 2. **Sistem Keranjang Belanja**
- ➕ Tambah/kurangi jumlah produk
- 🗑️ Hapus item dari keranjang
- 💰 Kalkulasi otomatis total harga
- 💾 Persistent cart (tersimpan di database)

#### 3. **Checkout & Pembayaran**
- 📦 Review pesanan sebelum checkout
- 📍 Manajemen alamat pengiriman
- 💳 Integrasi Xendit Payment Gateway
- 📧 Notifikasi pembayaran via email
- 🧾 Invoice yang bisa diunduh sebagai PDF

#### 4. **Invoice PDF Generator**
- 📄 Generate invoice profesional dengan branding Fajar Gold
- ⬇️ Download langsung sebagai PDF
- 📊 Informasi lengkap: Invoice ID, tanggal, customer info, total pembayaran
- 🎨 Design modern dengan gradient emas

#### 5. **Chat Real-time dengan Admin**
- 💬 Chat langsung dengan customer service
- 🔴 Notifikasi badge untuk pesan belum dibaca
- ✅ Auto mark as read saat chat dibuka
- 🟢 Indikator status online/offline
- 📱 Responsive chat interface

#### 6. **Wishlist**
- ❤️ Simpan produk favorit
- 🔄 Sinkronisasi real-time dengan backend
- 🛒 Quick add to cart dari wishlist

#### 7. **Riwayat Pesanan**
- 📋 Track status pesanan (Pending, Processing, Shipped, Delivered)
- 🔍 Detail lengkap setiap pesanan
- 💳 Sync status pembayaran dari Xendit
- 📄 Lihat invoice online atau download PDF

#### 8. **User Profile**
- 👤 Manajemen profil pengguna
- 📧 Update email dan informasi kontak
- 📍 Manajemen alamat pengiriman
- 📊 Statistik belanja

### 🎛️ Fitur Admin

#### 1. **Dashboard Interaktif**
- 📊 Grafik penjualan 12 bulan terakhir (Bar Chart)
- 📈 4 Kartu statistik utama:
  - 💰 Total Penjualan Bulan Ini
  - 🛍️ Pesanan Baru
  - 👥 Total Pelanggan
  - 📦 Produk Terjual
- 🔥 Top 5 Produk Terlaris
- 🔄 Auto-refresh data setiap 30 detik
- 🌙 Dark mode support

#### 2. **Manajemen Produk**
- ➕ Tambah produk baru
- ✏️ Edit informasi produk
- 🗑️ Hapus produk
- 🖼️ Upload gambar produk
- 📊 Track stok dan produk terjual

#### 3. **Manajemen Pesanan**
- 📋 Lihat semua pesanan
- 🔄 Update status pesanan
- 📦 Detail pesanan lengkap
- 💳 Track status pembayaran

#### 4. **Customer Service Chat**
- 💬 Chat dengan semua customer
- 📱 Daftar conversation dengan unread count
- 🟢 Real-time online/offline status customer
- ✅ Auto mark as read
- 🔄 Polling backup untuk online status

#### 5. **Manajemen Customer**
- 👥 Lihat daftar semua customer
- 📊 Statistik customer
- 📧 Informasi kontak customer

#### 6. **Laporan & Analytics**
- 📈 Statistik penjualan
- 📊 Produk terlaris
- 📉 Trend penjualan bulanan

---

## 🚀 Tech Stack

### Frontend Framework
- **React 19.2** - Latest React version dengan Server Components
- **React Router DOM 7.10** - Client-side routing
- **Vite 7.2** - Lightning-fast build tool dengan HMR

### UI/UX Libraries
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Framer Motion 12.23** - Production-ready animation library
- **Lucide React 0.556** - Beautiful & consistent icon set
- **Canvas Confetti 1.9** - Celebration animations

### State Management & Data Fetching
- **Axios 1.13** - Promise-based HTTP client
- **React Hooks** - Built-in state management (useState, useEffect, useRef, useCallback)

### Real-time Communication
- **@stomp/stompjs 7.2** - STOMP protocol over WebSocket
- **SockJS Client 1.6** - WebSocket fallback untuk browser lama
- **WebSocket** - Bidirectional real-time communication

### Data Visualization
- **Chart.js 4.5** - Simple yet flexible charting library
- **React Chart.js 2 5.3** - React wrapper untuk Chart.js

### Document Generation
- **jsPDF 3.0** - PDF generation library
- **html2canvas 1.4** - HTML to canvas converter untuk PDF

### Development Tools
- **ESLint 9.39** - Code linting dengan React hooks rules
- **Vite Plugin React SWC 4.2** - Ultra-fast React refresh menggunakan SWC
- **TypeScript Types** - Type definitions untuk better DX

### Build & Bundler
- **Vite** - Next-generation frontend tooling
- **SWC** - Super-fast TypeScript/JavaScript compiler (pengganti Babel)
- **PostCSS** - CSS transformation tool

---

## 📁 Struktur Direktori

```
projek-fajar/
├── public/                     # Static assets
├── src/
│   ├── api/                    # API Configuration
│   │   └── Axios.jsx          # Axios instance dengan interceptors
│   │
│   ├── auth/                   # Authentication Pages
│   │   ├── Login.jsx          # User login page
│   │   ├── LoginAdmin.jsx     # Admin login page
│   │   └── VerifyOtp.jsx      # OTP verification
│   │
│   ├── components/             # Reusable Components
│   │   ├── AdminHeader.jsx    # Admin header dengan notifications
│   │   ├── AdminLayout.jsx    # Admin layout wrapper
│   │   ├── AdminSidebar.jsx   # Admin sidebar navigation
│   │   ├── AuthModal.jsx      # Authentication modal
│   │   ├── Footer.jsx         # User footer
│   │   ├── Header.jsx         # User header dengan cart/wishlist badge
│   │   ├── InfiniteScrollCarousel.jsx  # Auto-scroll carousel
│   │   ├── ScrollToTop.jsx    # Auto scroll to top on route change
│   │   └── UserPresenceProvider.jsx    # WebSocket presence provider
│   │
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useWebSocket.js    # WebSocket connection hook
│   │   └── useWebSocketPresence.js  # User presence tracking
│   │
│   ├── pages/                  # Page Components
│   │   │
│   │   ├── Admin Pages/
│   │   ├── AdminChat.jsx      # Admin chat dengan customers
│   │   ├── AdminCustomers.jsx # Customer management
│   │   ├── AdminDashboard.jsx # Main admin dashboard
│   │   ├── AdminOrders.jsx    # Order management
│   │   ├── AdminProducts.jsx  # Product management
│   │   └── AdminReports.jsx   # Reports & analytics
│   │   │
│   │   ├── User Pages/
│   │   ├── Checkout.jsx       # Checkout page
│   │   ├── DetailPesanan.jsx  # Order detail
│   │   ├── Katalog.jsx        # Product catalog dengan filter/sort
│   │   ├── Keranjang.jsx      # Shopping cart (legacy)
│   │   ├── KeranjangPage.jsx  # Shopping cart page
│   │   ├── Kontak.jsx         # Contact page
│   │   ├── Payment.jsx        # Payment processing
│   │   ├── PaymentHistory.jsx # Payment history
│   │   ├── PaymentStatus.jsx  # Payment status callback
│   │   ├── Pesanan.jsx        # Orders page
│   │   ├── Tentang.jsx        # About page
│   │   ├── UserChat.jsx       # User chat dengan admin
│   │   ├── UserHome.jsx       # Homepage
│   │   ├── UserProfile.jsx    # User profile & settings
│   │   └── Wishlist.jsx       # Wishlist page
│   │
│   ├── index.css               # Global styles & Tailwind imports
│   └── main.jsx                # App entry point dengan React Router
│
├── .gitignore                  # Git ignore rules
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML template
├── jsconfig.json               # JavaScript configuration
├── package.json                # Dependencies & scripts
├── pnpm-lock.yaml              # PNPM lock file
├── README.md                   # This file
├── swagger.yaml                # API documentation (backend)
├── tailwind.config.js          # Tailwind CSS configuration
└── vite.config.js              # Vite configuration
```

### Penjelasan Struktur

#### 📂 `/src/api`
Konfigurasi Axios dengan base URL dan interceptors untuk:
- Auto-attach Authorization header
- Handle 401 Unauthorized errors
- Request/Response logging

#### 🔐 `/src/auth`
Halaman-halaman autentikasi:
- Login user dan admin terpisah
- OTP verification untuk keamanan ekstra

#### 🧩 `/src/components`
Komponen reusable:
- Layout components (Header, Footer, Sidebar)
- Modal components
- Carousel components
- Provider components untuk WebSocket

#### 🪝 `/src/hooks`
Custom hooks untuk logic reuse:
- WebSocket connection management
- User presence tracking

#### 📄 `/src/pages`
Route-level components dibagi menjadi:
- **Admin Pages**: Dashboard, Product Management, Order Management, Chat
- **User Pages**: Homepage, Catalog, Cart, Checkout, Profile

---

## 📋 Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **PNPM** >= 8.0.0 ([Install](https://pnpm.io/installation))
  ```bash
  npm install -g pnpm
  ```
- **Git** ([Download](https://git-scm.com/))

### Cek Versi
```bash
node --version   # Harus >= v18.0.0
pnpm --version   # Harus >= 8.0.0
git --version    # Any version
```

---

## 📥 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/your-username/projek-fajar.git
cd projek-fajar
```

### 2. Install Dependencies

Menggunakan PNPM (recommended):
```bash
pnpm install
```

Atau menggunakan NPM:
```bash
npm install
```

### 3. Konfigurasi Environment

Buat file `.env` di root folder (opsional):
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080

# WebSocket Configuration
VITE_WS_URL=http://localhost:8080/ws

# Other configs
VITE_APP_NAME=Fajar Gold
```

> **Note**: Jika tidak ada file `.env`, aplikasi akan menggunakan `http://localhost:8080` sebagai default base URL.

---

## 🏃 Menjalankan Aplikasi

### Development Mode

```bash
pnpm dev
```

Aplikasi akan berjalan di: **http://localhost:5173**

### Features Development Mode:
- ⚡ Hot Module Replacement (HMR)
- 🔄 Fast Refresh untuk React components
- 🐛 Source maps untuk debugging
- 🚀 Optimized untuk development speed

### Preview Production Build

```bash
pnpm preview
```

Preview build production di: **http://localhost:4173**

---

## 🏗️ Build Production

### Build untuk Production

```bash
pnpm build
```

Output akan tersimpan di folder `/dist`

### Optimizations:
- ⚡ Code splitting otomatis
- 🗜️ Minification dengan Terser
- 📦 Tree shaking untuk remove unused code
- 🖼️ Image optimization
- 💾 Caching dengan content hashing

### Build Statistics:
```bash
# Analyze bundle size
pnpm build -- --mode analyze
```

---

## 🎯 Fitur Detail

### 1. Real-time Chat System

#### Customer Side (`UserChat.jsx`)
```javascript
// WebSocket connection dengan STOMP
const stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    connectHeaders: { Authorization: `Bearer ${token}` },
    onConnect: () => {
        // Subscribe ke topic customer
        client.subscribe(`/topic/chat/customer/${userId}`, handleMessage);
    }
});

// Auto mark as read saat buka chat
useEffect(() => {
    if (adminId) {
        api.post(`/api/chat/mark-read?senderId=${adminId}`);
        window.dispatchEvent(new Event('chat:read'));
    }
}, [adminId]);
```

#### Admin Side (`AdminChat.jsx`)
```javascript
// Subscribe ke 2 topics
client.subscribe(`/topic/chat/admin/${adminProfile.id}`, handleIncomingMessage);
client.subscribe("/topic/user.presence", handlePresenceUpdate);

// Handle incoming message dengan auto mark as read
const handleIncomingMessage = async (newMsg) => {
    if (isFromSelected && newMsg.senderRole === "USER") {
        await api.post(`/api/chat/mark-read?senderId=${newMsg.senderId}`);
    }
    // Update messages dan conversations list
};

// Polling backup untuk online status (fallback jika WebSocket gagal)
setInterval(() => {
    api.get("/api/chat/online-users").then(updateOnlineStatus);
}, 15000);
```

**Key Features:**
- ✅ Real-time message delivery
- ✅ Read receipts
- ✅ Online/offline indicators
- ✅ Unread count badges
- ✅ Optimistic UI updates
- ✅ Fallback polling untuk reliability

---

### 2. Invoice PDF Generator

```javascript
// Generate invoice dengan html2canvas + jsPDF
const downloadInvoice = async (payment) => {
    // 1. Create HTML invoice template
    const invoiceHTML = `
        <div style="...professional invoice design...">
            <h1>FAJAR GOLD</h1>
            <!-- Invoice details -->
        </div>
    `;
    
    // 2. Render HTML off-screen
    container.innerHTML = invoiceHTML;
    document.body.appendChild(container);
    
    // 3. Convert to canvas
    const canvas = await html2canvas(container, {
        scale: 3,  // High quality
        backgroundColor: '#ffffff'
    });
    
    // 4. Generate PDF
    const pdf = new jsPDF({
        orientation: 'portrait',
        format: 'a4'
    });
    
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, height);
    pdf.save(`Invoice_${payment.externalId}.pdf`);
};
```

**Features:**
- 🎨 Professional design dengan branding Fajar Gold
- 📊 Informasi lengkap: Invoice ID, dates, customer info, amount
- 🖼️ High-quality rendering (scale: 3)
- 💾 Auto-download dengan nama file yang informatif
- ✅ Conditional rendering (hanya untuk status PAID/SETTLED)

---

### 3. Product Catalog dengan Advanced Filtering

```javascript
// Katalog.jsx - Smart filtering & sorting
const applyFiltersAndSort = (products) => {
    let filtered = [...products];
    
    // 1. Filter by category
    if (categoryFilter !== "Semua") {
        filtered = filtered.filter(p => p.kategori === categoryFilter);
    }
    
    // 2. Filter by search query
    if (searchQuery) {
        filtered = filtered.filter(p => 
            p.namaProduk.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    // 3. Apply sorting
    switch (sortBy) {
        case "harga_asc":
            filtered.sort((a, b) => a.harga - b.harga);
            break;
        case "harga_desc":
            filtered.sort((a, b) => b.harga - a.harga);
            break;
        case "karat_asc":
            filtered.sort((a, b) => (a.karatEmas || 0) - (b.karatEmas || 0));
            break;
        case "karat_desc":
            filtered.sort((a, b) => (b.karatEmas || 0) - (a.karatEmas || 0));
            break;
        default: // terbaru
            // Keep original order
    }
    
    return filtered;
};

// 4. Pagination
const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
);
```

**Features:**
- 🔍 Kombinasi filter: category + search
- 🔄 5 opsi sorting dengan null-safe handling
- 📄 Smart pagination dengan auto-reset
- 📱 Responsive filter UI (collapsible di mobile)
- ⚡ Real-time filtering tanpa page reload

---

### 4. Admin Dashboard dengan Live Charts

```javascript
// AdminDashboard.jsx - Chart.js Integration
useEffect(() => {
    if (!chartReady || !chartCanvasRef.current) return;
    
    const ctx = chartCanvasRef.current.getContext("2d");
    
    // Gradient untuk visualisasi yang menarik
    const gradientGold = ctx.createLinearGradient(0, 0, 0, 400);
    gradientGold.addColorStop(0, "rgba(251, 191, 36, 0.9)");
    gradientGold.addColorStop(1, "rgba(245, 158, 11, 0.7)");
    
    // Dual Y-axis chart
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels, // 12 bulan
            datasets: [
                {
                    label: "Total Penjualan (Rp)",
                    data: salesData,
                    yAxisID: "y",  // Left axis
                },
                {
                    label: "Produk Terjual",
                    data: productData,
                    yAxisID: "y1", // Right axis
                }
            ]
        },
        options: {
            scales: {
                y: { 
                    position: "left",
                    title: { text: "Penjualan (Rp)" }
                },
                y1: { 
                    position: "right",
                    title: { text: "Jumlah Produk" }
                }
            }
        }
    });
}, [chartReady, labels, salesData, productData]);

// Auto-refresh setiap 30 detik
useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
}, []);
```

**Features:**
- 📊 Bar chart interaktif dengan Chart.js
- 📈 Dual Y-axis untuk 2 metrik berbeda
- 🎨 Gradient colors untuk visual appeal
- 🔄 Auto-refresh data setiap 30 detik
- 💾 Dynamic script loading untuk Chart.js
- ⚡ Optimized rendering dengan cleanup

---

### 5. Shopping Cart dengan Persistent Storage

```javascript
// Keranjang.jsx - Cart Management
const addToCart = async (product) => {
    const token = localStorage.getItem("user_token");
    
    await api.post("/api/keranjang", {
        produkId: product.id,
        jumlah: 1
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    
    // Trigger cart update event
    window.dispatchEvent(new Event('cart:update'));
    
    // Confetti celebration 🎉
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
};

// Header.jsx - Listen for cart updates
useEffect(() => {
    const onCartUpdate = () => fetchCartCount();
    window.addEventListener("cart:update", onCartUpdate);
    return () => window.removeEventListener("cart:update", onCartUpdate);
}, [fetchCartCount]);
```

**Features:**
- 💾 Persistent cart (tersimpan di database)
- 🔄 Real-time sync across tabs via events
- 🎉 Celebration animation saat add to cart
- 🔢 Badge count di header
- ➕➖ Increment/decrement quantity
- 🗑️ Remove items

---

## 🔌 API Integration

### Base Configuration

```javascript
// src/api/Axios.jsx
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('user_token') || 
                     localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);
```

### Endpoints

#### 🔐 Authentication
```javascript
POST   /api/auth/login            // User login
POST   /api/auth/admin/login      // Admin login
POST   /api/auth/verify-otp       // OTP verification
POST   /api/auth/logout           // Logout
```

#### 👤 User Management
```javascript
GET    /api/user/profile          // Get user profile
PUT    /api/user/profile          // Update profile
GET    /api/user/total-pelanggan  // Get total customers (admin)
```

#### 📦 Products
```javascript
GET    /api/produk                // Get all products
GET    /api/produk/{id}           // Get product by ID
POST   /api/produk                // Create product (admin)
PUT    /api/produk/{id}           // Update product (admin)
DELETE /api/produk/{id}           // Delete product (admin)
GET    /api/terjual-produk        // Get best selling products
```

#### 🛒 Cart
```javascript
GET    /api/keranjang             // Get cart items
POST   /api/keranjang             // Add to cart
PUT    /api/keranjang/{id}        // Update cart item
DELETE /api/keranjang/{id}        // Remove from cart
```

#### ❤️ Wishlist
```javascript
GET    /api/wishlist              // Get wishlist
POST   /api/wishlist              // Add to wishlist
DELETE /api/wishlist/{id}         // Remove from wishlist
```

#### 📋 Orders
```javascript
GET    /api/pesanan               // Get user orders
POST   /api/pesanan               // Create order
GET    /api/pesanan/{id}          // Get order detail
PUT    /api/pesanan/{id}/status   // Update order status (admin)
```

#### 💳 Payments
```javascript
POST   /api/payments/create       // Create payment
GET    /api/payments/{id}         // Get payment detail
POST   /api/payments/sync/{externalId}  // Sync payment status
GET    /api/payments/callback     // Payment callback from Xendit
```

#### 💬 Chat
```javascript
GET    /api/chat/conversations    // Get all conversations (admin)
GET    /api/chat/history          // Get chat history
POST   /api/chat/mark-read        // Mark messages as read
GET    /api/chat/unread-count     // Get unread message count
GET    /api/chat/online-users     // Get online users
WS     /ws                         // WebSocket endpoint
```

#### 📊 Statistics (Admin)
```javascript
GET    /api/statistik/grafik/12-bulan           // 12-month sales chart
GET    /api/statistik/penjualan/bulan-ini       // Current month sales
GET    /api/statistik/produk-terjual/bulan-ini  // Current month products sold
GET    /api/statistik/pesanan/bulan-ini         // Current month orders
```

### WebSocket Topics

#### Subscribe (Client → Server)
```javascript
/topic/chat/customer/{userId}     // Customer chat messages
/topic/chat/admin/{adminId}       // Admin chat messages
/topic/user.presence               // User online/offline status
```

#### Publish (Client → Server)
```javascript
/app/chat.send                     // Send chat message
/app/user.presence                 // Update user presence
```

---

## 📸 Screenshots

### User Interface

#### Homepage
![Homepage](docs/screenshots/homepage.png)
*Homepage dengan hero section, featured products, dan infinite scroll carousel*

#### Product Catalog
![Catalog](docs/screenshots/catalog.png)
*Katalog produk dengan filter kategori, sorting, dan search*

#### Shopping Cart
![Cart](docs/screenshots/cart.png)
*Keranjang belanja dengan kalkulasi total dan quantity controls*

#### Checkout
![Checkout](docs/screenshots/checkout.png)
*Halaman checkout dengan form alamat dan review pesanan*

#### User Chat
![User Chat](docs/screenshots/user-chat.png)
*Real-time chat dengan admin dan unread notification badge*

### Admin Interface

#### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin-dashboard.png)
*Dashboard dengan statistik cards, chart 12 bulan, dan top products*

#### Admin Chat
![Admin Chat](docs/screenshots/admin-chat.png)
*Admin chat interface dengan customer list dan online status*

#### Product Management
![Product Management](docs/screenshots/admin-products.png)
*Manajemen produk dengan CRUD operations*

---

## 🤝 Contributing

Kontribusi sangat diterima! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Guidelines

- Ikuti code style yang sudah ada
- Tambahkan tests untuk fitur baru
- Update dokumentasi jika diperlukan
- Pastikan semua tests pass sebelum PR

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

**Fajar Gold Team**

- Email: contact@fajargold.com
- Website: https://fajargold.com
- GitHub: [@fajargold](https://github.com/fajargold)

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - The library for web and native user interfaces
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Tailwind CSS](https://tailwindcss.com/) - Rapidly build modern websites
- [Chart.js](https://www.chartjs.org/) - Simple yet flexible JavaScript charting
- [Framer Motion](https://www.framer.com/motion/) - Production-ready animation library
- [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons
- [Xendit](https://www.xendit.co/) - Payment gateway integration

---

<div align="center">

**Made with ❤️ by Fajar Gold Team**

⭐ Star this repo if you find it helpful!

</div>
