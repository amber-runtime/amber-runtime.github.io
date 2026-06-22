import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://amber-runtime.github.io',
  base: '/',
  trailingSlash: 'never',
  build: { format: 'directory' },
});
