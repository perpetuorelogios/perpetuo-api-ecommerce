import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['cjs'],       // Você está usando CJS
  splitting: false,
  sourcemap: true,
  clean: true,
  // 👇 ADICIONE ESTA LINHA:
  shims: true,
})