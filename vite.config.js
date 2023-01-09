import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: process.env.GITHUB_PAGES ? 'water-divination'  : './',
})
