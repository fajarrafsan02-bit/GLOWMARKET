# Dokumen Konsistensi UI: VerifyOtp & LoginAdmin

## Ringkasan
Dokumen ini menjelaskan perubahan yang diperlukan untuk menyelaraskan tampilan VerifyOtp.jsx agar konsisten dengan LoginAdmin.jsx yang memiliki fitur tema dark/light.

## Perbedaan Utama yang Perlu Diselaraskan

### 1. Fitur Tema Dark/Light
**LoginAdmin**: Sudah memiliki toggle tema dengan state management
**VerifyOtp**: Belum memiliki fitur tema

### 2. Desain Kartu/Container
**LoginAdmin**: 
- Background blur dengan backdrop-blur-lg
- Border berwarna emas (yellow-400/50)
- Shadow khas emas
- Rounded-2xl

**VerifyOtp**:
- Background putih polos
- Shadow standar
- Rounded-3xl

### 3. Background Gradient
**LoginAdmin**: Gradient amber-50 via-white ke amber-50 (light), black via-gray-900 ke black (dark)
**VerifyOtp**: Gradient green-950 via-green-900 ke black (tidak konsisten)

### 4. Elemen Visual
**LoginAdmin**: Memiliki logo/icon, background pattern
**VerifyOtp**: Hanya teks header

## Perubahan yang Diperlukan

### 1. Implementasi Tema Dark/Light
```javascript
// Tambahkan state dan useEffect untuk tema
const [isDarkMode, setIsDarkMode] = useState(false);

// Load tema dari localStorage
useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(savedTheme ? savedTheme === "dark" : prefersDark);
}, []);

// Apply tema ke html
useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}, [isDarkMode]);
```

### 2. Update Container Design
```javascript
// Ubah container utama
<div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center px-4 relative overflow-hidden">
    
    {/* Tambahkan background pattern */}
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80')] dark:bg-[url('https://images.unsplash.com/photo-1611590029725-9f8e9c8be800?ixlib=rb-4.0.3&auto=format&fit=crop&q=80')] opacity-5 dark:opacity-10 bg-cover bg-center pointer-events-none"></div>

    {/* Update card container */}
    <div className="bg-white/90 dark:bg-black/70 backdrop-blur-lg border border-yellow-400/50 dark:border-yellow-600/40 rounded-2xl shadow-2xl shadow-yellow-300/40 dark:shadow-yellow-900/60 p-8 md:p-10 max-w-md w-full mx-4">
```

### 3. Update Header Section
```javascript
// Tambahkan logo dan update styling
<div className="text-center mb-8">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700 rounded-full mb-4 shadow-lg">
        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L13.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L10.91 8.26L12 2Z" />
        </svg>
    </div>
    <h2 className="text-3xl font-bold text-yellow-700 dark:text-yellow-500 tracking-wide">Verifikasi OTP</h2>
    <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Masukkan kode OTP yang dikirim ke email Anda</p>
</div>
```

### 4. Update OTP Input Fields
```javascript
// Update styling input OTP
className="w-16 h-16 text-3xl font-bold text-center border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 dark:focus:ring-yellow-800 transition-all outline-none bg-white dark:bg-gray-800/80 text-gray-900 dark:text-white"
```

### 5. Update Error Message Styling
```javascript
// Update error message styling
{error && (
    <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-600/50 rounded-lg text-red-700 dark:text-red-300 text-sm text-center">
        {error}
    </div>
)}
```

### 6. Update Submit Button
```javascript
// Update button styling
<button
    onClick={submit}
    disabled={loading}
    className={`w-full py-4 rounded-lg text-white dark:text-black font-bold transition-all shadow-lg ${loading
        ? "bg-yellow-700 dark:bg-yellow-600 cursor-not-allowed"
        : "bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-500 hover:from-yellow-400 dark:hover:from-yellow-500 dark:hover:to-yellow-400 transform hover:scale-105"
        }`}
>
    {loading ? "Memverifikasi..." : "Verifikasi OTP"}
</button>
```

### 7. Tambahkan Toggle Tema
```javascript
// Tambahkan setelah form
<div className="mt-8 flex justify-center">
    <button
        type="button"
        onClick={() => setIsDarkMode(prev => !prev)}
        className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md hover:shadow-xl transition-all duration-300 group"
        aria-label="Ganti tema"
    >
        {isDarkMode ? (
            <svg className="w-6 h-6 text-yellow-500 group-hover:rotate-180 transition duration-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg className="w-6 h-6 text-gray-800 group-hover:-rotate-90 transition duration-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
        )}
    </button>
</div>
```

### 8. Tambahkan Footer
```javascript
// Tambahkan footer
<div className="mt-6 text-center">
    <p className="text-xs text-gray-500 dark:text-gray-500">© 2025 Toko Emas Online - Luxury & Elegance</p>
</div>
```

## Bug yang Perlu Diperbaiki

### 1. LocalStorage Bug di VerifyOtp
```javascript
// Baris 55: Salah menyimpan namaLengkap
localStorage.setItem("admin_token", res.data.namaLengkap); // Salah

// Seharusnya:
localStorage.setItem("admin_nama", res.data.namaLengkap);
```

### 2. Import yang Tidak Konsisten
```javascript
// VerifyOtp menggunakan: import api from "../api/Axios";
// LoginAdmin menggunakan: import api from "../api/axios";

// Sesuaikan casing untuk konsistensi
```

## Kesimpulan
Dengan implementasi perubahan di atas, VerifyOtp akan memiliki:
- ✅ Konsistensi tema dark/light dengan LoginAdmin
- ✅ Desain container yang seragam
- ✅ Styling error message yang sama
- ✅ Button styling yang konsisten
- ✅ Background pattern yang selaras
- ✅ Toggle tema yang fungsional
- ✅ Footer informasi yang sama

Perubahan ini memastikan pengalaman pengguna yang konsisten antara halaman login dan verifikasi OTP.