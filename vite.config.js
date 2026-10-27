import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base + HashRouter keeps the static build deployable from any
// path (S3 + CloudFront, GitHub Pages, or a local file server) without
// server-side rewrite rules.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        // Keep the large third-party libraries in their own long-cached chunks.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('framer-motion') || id.includes('/motion')) return 'motion'
          if (id.includes('react-icons')) return 'icons'
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'react'
          return undefined
        },
      },
    },
  },
})
