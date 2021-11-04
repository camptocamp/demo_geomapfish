import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
    https: false,
    host: '0.0.0.0',
  },
  build: {
    lib: {
      entry: 'webcomponents/index.ts',
      formats: ['es'],
    },
    target: 'esnext',
    sourcemap: true,
  },
});
