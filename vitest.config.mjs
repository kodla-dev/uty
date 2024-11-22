import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.js'],
    environmentMatchGlobs: [['test/**/*.client.test.js', 'jsdom']],
  },
});
