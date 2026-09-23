import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

export default defineConfig({
  resolve: {
    alias: {
      "@affinity-health/sdk": fileURLToPath(new URL("../../dist/index.js", import.meta.url)),
    },
  },
  plugins: [tanstackStart(), react()],
  root: fileURLToPath(new URL(".", import.meta.url)),
  server: {
    allowedHosts: process.env.EXAMPLE_ALLOWED_HOST?.split(",") ?? [],
    host: process.env.VITE_HOST ?? "127.0.0.1",
    port: Number(process.env.VITE_PORT ?? 5191),
    strictPort: true,
  },
});
