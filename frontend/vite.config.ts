import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  // Without VITE_API_URL the app silently falls back to localhost, so fail production builds instead.
  if (command === 'build' && mode === 'production') {
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    if (!env.VITE_API_URL) {
      throw new Error(
        'VITE_API_URL must be set to the deployed API (e.g. https://your-api.example.com/api/v1) for production builds.',
      )
    }
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      conditions: ['development', 'browser', 'module', 'jsnext:main', 'jsnext'],
    },
    optimizeDeps: {
      include: [
        '@vidstack/react',
        '@vidstack/react/player/layouts/default',
      ],
    },
  }
})
