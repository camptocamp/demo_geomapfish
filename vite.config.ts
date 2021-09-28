import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
    https: true,
    open: 'webcomponents/index.js',
  },
  build: {
    lib: {
      entry: 'webcomponents/index.ts',
      formats: ['es'],
    },
    sourcemap: true,
  },
});
