import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/npm
export default defineConfig({
  plugins: [react()],
  base: '/canary-karting/',
  build: {
    target: 'es2015',
  },
})
