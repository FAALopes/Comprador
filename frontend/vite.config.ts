import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Rebuild trigger: force deployment with VITE_API_URL environment variable
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
