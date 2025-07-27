import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Configure Vitest (https://vitest.dev/config/)
  test: {
    alias: {
      '@folderkit/': new URL('./src/', import.meta.url).pathname,
    },
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/types'],
    },
    reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['dot'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
