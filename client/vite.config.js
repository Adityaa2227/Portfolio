import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Libraries go into their own files: they change rarely, so browsers keep them cached
// across deploys, and the app code (which changes often) stays small.
const VENDOR_CHUNKS = {
  react: ['react', 'react-dom', 'react-router', 'react-router-dom', 'scheduler'],
  motion: ['gsap', 'lenis'],
  icons: ['lucide-react', 'react-icons'],
  three: ['three'],
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          const pkg = id.split('node_modules/').pop().split('/')
          const name = pkg[0].startsWith('@') ? `${pkg[0]}/${pkg[1]}` : pkg[0]
          return Object.keys(VENDOR_CHUNKS).find((chunk) => VENDOR_CHUNKS[chunk].includes(name))
        },
      },
    },
  },
})
