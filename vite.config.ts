import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: parseInt(process.env.VITE_PORT || process.env.PORT || "4000"), // Default to 4000 for local dev
  },
  optimizeDeps: {
    include: [
      "@vidstack/react",
      "@vidstack/react/player/layouts/default",
      "recharts",
      "react-is",
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "axios",
    ],
  },
  build: {
    outDir: "dist",
  },
});
