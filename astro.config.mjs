import { defineConfig } from 'astro/config';

export default defineConfig({
  redirects: { '/programs/presence': '/programs' },
  server: {
    host: true,
    port: 4321,
    allowedHosts: true
  }
});