import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
// import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, './src'),
  //     '@pages': path.resolve(__dirname, './src/pages'),
  //     '@components': path.resolve(__dirname, './src/components'),
  //     '@auth': path.resolve(__dirname, './src/auth'),
  //     '@api': path.resolve(__dirname, './src/api')
  //   }
  // },
  define: {
    global: 'globalThis',
  },
})
