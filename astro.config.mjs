import { defineConfig } from 'astro/config';

export default defineConfig({
  // Presence is the single online program and lives at /programs.
  redirects: { '/programs/presence': '/programs' },
  server: {
    host: true,
    port: 4321,
    allowedHosts: true
  }
});