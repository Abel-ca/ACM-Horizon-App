import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Anthropic API — routed server-side to avoid CORS
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
      },
      // Meta token exchange — Vercel serverless function.
      // For local dev: run `vercel dev` (port 3000) alongside `vite dev`,
      // or just deploy to Vercel where /api/* is served automatically.
      '/api/meta-token': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
