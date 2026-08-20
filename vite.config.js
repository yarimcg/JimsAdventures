import { defineConfig } from "vite"

// Minimal config: serve the existing static HTML/CSS/JS site as-is.
export default defineConfig({
  server: {
    host: true,
    port: Number(process.env.PORT) || Number(process.env.DEV_PORT) || 3000,
    strictPort: false,
  },
  preview: {
    host: true,
    port: Number(process.env.PORT) || Number(process.env.DEV_PORT) || 3000,
  },
})
