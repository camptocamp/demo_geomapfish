import {defineConfig} from 'vite';
import path from 'path';

let build_config =
  process.env.NODE_ENV === 'production'
    ? {}
    : {
        lib: {
          entry: '.',
          name: 'gmf',
        },
      };

export default defineConfig({
  server: {
    port: 3002,
    //https: true,
  },
  base: '/static-frontend/',
  build: {
    lib: {
      entry: '.',
      formats: ['es'],
    },
    publicDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        desktop: path.resolve(__dirname, 'desktop.html'),
        mobile: path.resolve(__dirname, 'mobile.html'),
        iframe_api: path.resolve(__dirname, 'iframe_api.html'),
      },
      output: {
        inlineDynamicImports: false,
      },
    },
    ...build_config,
  },
  resolve: {
    alias: {
      'ngeo': path.resolve(__dirname, 'node_modules/ngeo/distlib/src'),
      'gmf': path.resolve(__dirname, 'node_modules/ngeo/distlib/src'),
      'gmfapi': path.resolve(__dirname, 'node_modules/ngeo/distlib/srcapi'),
      'api': path.resolve(__dirname, 'node_modules/ngeo/distlib/api'),
      'jquery-ui/datepicker': path.resolve(__dirname, 'empty.js'), // For angular-ui-date
      // Save about of 45k os bandwidth (gzipped) by unworking ignoring import done by a script downloaded from a CDN.
      'bootstrap/js/src/popover': path.resolve(__dirname, 'empty.js'),
      'bootstrap/js/src/tooltip': path.resolve(__dirname, 'empty.js'),
      'bootstrap/js/src/alert': path.resolve(__dirname, 'empty.js'),
      'bootstrap/js/src/modal': path.resolve(__dirname, 'empty.js'),
      'bootstrap/js/src/collapse': path.resolve(__dirname, 'empty.js'),
      'bootstrap/js/src/dropdown': path.resolve(__dirname, 'empty.js'),
      'bootstrap': path.resolve(__dirname, 'empty.js'),
      'jquery-ui/ui/widgets/draggable': path.resolve(__dirname, 'empty.js'),
      'jquery-ui/ui/widgets/resizable': path.resolve(__dirname, 'empty.js'),
      'jquery-ui/ui/widgets/slider': path.resolve(__dirname, 'empty.js'),
      'jquery-ui/ui/widgets/sortable': path.resolve(__dirname, 'empty.js'),
      'jquery-ui/ui/i18n/datepicker-fr': path.resolve(__dirname, 'empty.js'),
      'jquery-ui/ui/i18n/datepicker-en-GB': path.resolve(__dirname, 'empty.js'),
      'jquery-ui/ui/i18n/datepicker-de': path.resolve(__dirname, 'empty.js'),
      'jquery-ui/ui/i18n/datepicker-it': path.resolve(__dirname, 'empty.js'),
      'jquery-ui': path.resolve(__dirname, 'empty.js'),
    },
  },
});
