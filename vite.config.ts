// @ts-nocheck
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/medicalapp/', // ✅ important: this fixes your build paths
  plugins: [react()],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    allowedHosts: ['onesoulcare.in'], // ✅ allows domain in dev
    host: true,
    port: 5173,
  },
})
