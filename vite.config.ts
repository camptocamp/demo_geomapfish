// https://vitejs.dev/config/
export default {
  server: {
    port: 3001,
    https: true,
  },
  build: {
    lib: {
      entry: 'webcomponents/index.ts',
      formats: ['es'],
    },
    target: 'esnext',
    sourcemap: true,
  },
};
