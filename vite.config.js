import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // <-- Pastikan namanya '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})