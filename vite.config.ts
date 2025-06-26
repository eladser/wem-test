import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Environment variables
  envPrefix: 'VITE_',
  
  // GitHub Pages configuration
  base: process.env.NODE_ENV === 'production' ? '/wem-test/' : '/',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['lucide-react']
        }
      }
    }
  },
  
  server: {
    port: 5173,
    host: '0.0.0.0', // Allow external connections
    strictPort: true, // Exit if port is already in use
    cors: {
      origin: ['http://localhost:5000', 'http://127.0.0.1:5000'],
      credentials: true
    },
    hmr: {
      port: 24678, // Use different port for HMR WebSocket to avoid conflicts
      host: 'localhost'
    },
    proxy: {
      // Proxy API requests to backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: false // Don't proxy WebSocket through this rule
      },
      // Proxy WebSocket connections to backend
      '/ws': {
        target: 'ws://localhost:5000',
        ws: true, // Enable WebSocket proxying
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  // Define global variables for browser compatibility
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    },
    global: 'globalThis',
  }
})
