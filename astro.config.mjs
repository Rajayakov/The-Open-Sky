import { defineConfig } from 'astro/config';

export default defineConfig({
  server: {
    host: true,
    port: 4321,
    allowedHosts: true
  }
});