import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'prompt',
    includeAssets: ['android-chrome-192x192.png', 'android-chrome-512x512.png', ' apple-touch-icon.png', 'favicon-32x32.png'],
    injectRegister: 'inline',
    workbox: {
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [{
        urlPattern: '/',
        handler: 'NetworkFirst' as const,
        options: {
          cacheName: 'api-cache',
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      }],
    },

    manifest: {
      name: 'ImKhok',
      short_name: 'ImKhok',
      description: 'Read Comics',
      theme_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      orientation: 'portrait',
      background_color: '#ffffff',
      icons: [
        {
          src: './android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: './android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: './apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: './favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
          purpose: 'any',
        },

      ],
    },
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
