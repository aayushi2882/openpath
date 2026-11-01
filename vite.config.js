import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, resolve(process.cwd(), 'frontend'), '')
  const serverEnv = loadEnv(mode, resolve(process.cwd(), 'backend'), '')
  const apiBaseUrl = env.VITE_API_BASE_URL?.trim()
  const backendPort = Number(serverEnv.PORT || process.env.PORT || env.PORT || 5501)

  return {
    root: resolve(process.cwd(), 'frontend'),
    publicDir: resolve(process.cwd(), 'frontend/public'),
    build: {
      outDir: resolve(process.cwd(), 'dist'),
      emptyOutDir: true,
    },
    plugins: [react()],
    server: {
      port: 5173,
      proxy: apiBaseUrl ? undefined : {
        '/api': {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true,
        },
      },
    },
  }
})
