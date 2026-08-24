import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: ['**/A314Games-Extra/**/*.mp4'],
    },
  },
  build: {
    target: 'es2022',
  },
})
