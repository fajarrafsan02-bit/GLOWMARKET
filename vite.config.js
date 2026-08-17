import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
// import path from 'path'

const BACKEND_URL = 'http://localhost:8080'

// Frontend dan backend harus tampak sebagai satu origin di mata browser agar
// cookie autentikasi httpOnly terkirim otomatis (SameSite=Lax menahan cookie
// lintas-origin tanpa proxy ini). Proxy ini meneruskan permintaan secara
// transparan di sisi server — Set-Cookie dari backend tetap sampai ke browser
// seolah datang dari localhost:5173 karena tidak ada atribut Domain eksplisit
// di cookie-nya (lihat AuthCookieService di backend).
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'globalThis',
  },
  server: {
    proxy: {
      '/auth': { target: BACKEND_URL, changeOrigin: true },
      '/api': { target: BACKEND_URL, changeOrigin: true },
      '/uploads': { target: BACKEND_URL, changeOrigin: true },
      '/ws': { target: BACKEND_URL, changeOrigin: true, ws: true },
    },
  },
})
