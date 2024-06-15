import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default {
  build: {
    rollupOptions: {
      external: [
        'stream',
        'querystring',
        'events',
        'child_process',
        'fs',
        'os',
        'path',
        'url',
        'buffer',
        'crypto',
        'http',
        'https',
        'net',
        'tls',
        'util'
      ]
    }
  }
};
