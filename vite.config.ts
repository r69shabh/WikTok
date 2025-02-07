import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Changed from 3000 to avoid conflict with backend
    strictPort: true, // Ensure Vite uses exactly this port
    hmr: {
      host: 'localhost',
      port: 5173, // Match the server port
      clientPort: 5173 // Explicitly set client port
    }
  }
})
