import {defineConfig} from 'vite';
import path from 'path';
import inject from '@rollup/plugin-inject';

export default defineConfig({
  server: {
    port: 3002,
    //https: true,
  },
  build: {
    lib: {
      entry: 'interfaces',
      formats: ['es'],
    },
    target: 'esnext',
    sourcemap: true,
  },
  resolve: {
    alias: {
      'ngeo': path.resolve(__dirname, 'node_modules/ngeo/distlib/src'),
      'gmf': path.resolve(__dirname, 'node_modules/ngeo/distlib/src'),
      'gmfapi': path.resolve(__dirname, 'node_modules/ngeo/distlib/srcapi'),
      'api': path.resolve(__dirname, 'node_modules/ngeo/distlib/api'),
      'jquery-ui/datepicker': path.resolve(__dirname, 'node_modules/jquery-ui/ui/widgets/datepicker'), // For angular-ui-date
    },
  },
  plugins: [
    inject({
      jQuery: 'jquery',
      $: 'jquery',
    }),
  ],
  optimizeDeps: {
    include: ['jquery'],
  },
});
