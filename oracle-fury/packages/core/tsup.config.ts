import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false, // Temporarily disable to fix build
  sourcemap: true,
  clean: true,
  minify: false,
  target: 'es2022',
  external: ['ajv', 'ajv-formats', 'nanoid', 'zod'],
});