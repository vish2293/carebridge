import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: '../../', // read the shared .env from the repo root
  server: {
    host: true,
    port: 5174
  }
});
