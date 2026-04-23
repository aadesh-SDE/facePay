import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Keep API on :3000 (backend); avoid clashing with Express default PORT.
    port: 5173,
    host: true,
  },
});
