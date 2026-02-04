import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.taskflow-production-88a4.up.railway.app/api || 'http://localhost:5000/api'

  return defineConfig({
    plugins: [react()],
    server: {
      port: 5173,
      open: true
    },
    define: {
      'import.meta.env.taskflow-production-88a4.up.railway.app/api': JSON.stringify(apiUrl)
    }
  })
}