// @ts-nocheck
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [react()],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    allowedHosts: ['onesoulcare.in'], // ✅ Allow your domain
    host: true, // ✅ Optional: allows access from external hosts/IPs
    port: 5173, // (change if you’re using another port)
  },
})
