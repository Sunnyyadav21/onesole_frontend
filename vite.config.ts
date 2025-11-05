// @ts-nocheck
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/medicalapp/', // 👈 important
  plugins: [react()],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    allowedHosts: ['onesoulcare.in'],
    host: true,
    port: 5173,
  },
})
