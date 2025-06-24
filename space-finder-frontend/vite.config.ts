import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
      stream: "stream-browserify",
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    include: ["@aws-sdk/client-s3"],
  },
});
