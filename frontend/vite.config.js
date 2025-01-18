import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Get the backend URL from environment variables
const backendUrl =
  process.env.VITE_BACKEND_URL || "https://xclone-e8tr.onrender.com";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy:
      process.env.NODE_ENV === "development"
        ? {
            "/api": {
              target: backendUrl,
              changeOrigin: true,
            },
          }
        : undefined, // Disable proxy in production
  },
});
