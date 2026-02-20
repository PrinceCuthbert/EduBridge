import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - generates stats.html after build
    visualizer({
      open: true, // Auto-open the stats page after build
      gzipSize: true, //Show gzip sizes
      brotliSize: true, // Show brotli sizes
      filename: 'dist/stats.html', // Output file
    }),
    VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'tmlogo.jpg', 'robots.txt'],
  manifest: {
    name: 'TM EduBridge',
    short_name: 'EduBridge',
    description: 'Study Abroad & Visa Consultancy Platform',
    theme_color: '#1e3a8a',
    background_color: '#ffffff',
    display: 'standalone',
    icons: [
      { src: '/tmlogo.jpg', sizes: '192x192', type: 'image/jpeg' },
      { src: '/tmlogo.jpg', sizes: '512x512', type: 'image/jpeg' },
    ],
  },
  workbox: {
    // Increase limit to 6MB to allow large assets like headshot.png (5.3MB)
    maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
    // Cache JS/CSS chunks (hashed = safe to cache forever)
    globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,webp,woff2}'],
    // Cache API/data calls for 1 hour with stale-while-revalidate
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'gstatic-fonts-cache',
          expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
        },
      },
    ],
  },
})
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'motion-vendor': ['framer-motion'],
          'utils-vendor': ['aos', 'i18next', 'react-i18next'],
        },
      },
    },
    // Increase chunk size warning limit (default is 500kb)
    chunkSizeWarningLimit: 600,
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
