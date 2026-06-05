import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      POSTGRES_URL: "postgres://default:password@localhost:5432/test"
    },
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
