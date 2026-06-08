import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from a subfolder on GitHub Pages: https://<user>.github.io/deneme5/
export default defineConfig({
  base: '/deneme5/',
  plugins: [react()],
})
