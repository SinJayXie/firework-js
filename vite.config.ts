import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/Firework.ts',
      name: 'Firework',
      fileName: 'firework'
    }
  }
})
