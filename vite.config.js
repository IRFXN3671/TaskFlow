import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000/api'

  return defineConfig({
    plugins: [react()],
    server: {
      port: 5173,
      open: true
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl)
    }
  })
}