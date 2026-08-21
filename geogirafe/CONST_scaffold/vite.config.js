// SPDX-License-Identifier: Apache-2.0
import {defineConfig} from 'vite';
import {resolve} from 'path';
import {readFileSync} from 'fs';

import {InlineTemplatesPlugin} from '@geogirafe/lib-geoportal/buildtools';
import {HtmlRebuildPlugin} from '@geogirafe/lib-geoportal/buildtools';
import {createHtmlPlugin} from 'vite-plugin-html';
import {viteStaticCopy} from 'vite-plugin-static-copy';
import dns from 'dns';
const analyzer = null;

/**
 * Custom name resolution for app.localhost:
 * Vite try to do a DNS-Lookup when starting the dev server
 * and app.localhost is not defined anywhere.
 * We do not want to define on each client,
 * so the default dns lookup method is overriden
 * to resolve app.localhost to 127.0.0.1
 */
const originalDnsLookup = dns.lookup;
function customDnsLookup(hostname, arg1, arg2) {
  const callback = typeof arg1 === 'function' ? arg1 : arg2;
  const options = typeof arg1 === 'function' ? undefined : arg1;
  if (hostname === 'app.localhost') {
    callback(null, '0.0.0.0', 4); // use '0.0.0.0' for being accessible from other devices on the network
  } else {
    originalDnsLookup(hostname, options, callback);
  }
}
dns.lookup = customDnsLookup;

// This is the base url for static files that CesiumJS needs to load.
// Set to an empty string to place the files at the site's root path
const cesiumSource = 'node_modules/cesium/Build/Cesium';
// Default configuration for Cesium (see https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/)
const cesiumBaseUrl = 'lib/cesium/';

// Default prefix. Must be 'src' when working locally on the gg-viewer project
// Will be automatically set to the library path when working with the library @geogirafe/lib-geoportal
const geogirafeSource = 'node_modules/@geogirafe/lib-geoportal';

// Path where the SSL-Certificates for local debugging are stored
// Will be automatically set to the right path when working with the library
const certsDirectory = 'certs';

// https://v2.vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  return {
    base: './',
    server: {
      host: 'app.localhost',
      port: 8080,
      strictPort: true,
      https:
        command === 'serve'
          ? {
              key: readFileSync(`${certsDirectory}/app.localhost.key.pem`),
              cert: readFileSync(`${certsDirectory}/app.localhost.cert.pem`),
            }
          : false,
    },
    build: {
      outDir: 'dist/app',
      sourcemap: true,
      emptyOutDir: true,
      chunkSizeWarningLimit: 2500,
      rollupOptions: {
        input: {
          desktop: resolve(__dirname, 'index.html'),
          custom: resolve(__dirname, 'custom.html'),
          mobile: resolve(__dirname, 'mobile.html'),
          iframe: resolve(__dirname, 'iframe.html'),
          api: resolve(__dirname, 'api.html'),
        },
        output: {
          manualChunks: (id) => {
            // lazy loading for not priritary libraries
            const lazyDependencies = [
              '@geoblocks/mapfishprint',
              '@geoblocks/print',
              'buffer',
              'd3',
              'error-stack-parser',
              'file-saver',
              'tabulator-tables',
              'lz-string',
              'qr-code-styling',
              'source-map-js',
              'tippy.js',
              'vanilla-picker',
              'driver.js',
            ];
            if (lazyDependencies.some((dep) => id.includes(`node_modules/${dep}`))) {
              return 'lazy';
            }
            // lazy loading for cesium dependencies
            const cesiumDependencies = ['cesium', 'olcs/OLCesium'];
            if (cesiumDependencies.some((dep) => id.includes(`node_modules/${dep}`))) {
              return 'cesium';
            }
          },
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === 'api') {
              return 'geogirafe-api.js';
            }
            return 'assets/[name].[hash].js';
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name == 'api.css') return 'geogirafe-api.css';
            return 'assets/[name].[hash].[ext]';
          },
        },
      },
    },
    plugins: [
      viteStaticCopy({
        targets: [
          {src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl},
          {src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl},
          {src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl},
          {src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl},
          {src: `${geogirafeSource}/tools/sw/*.js`, dest: ''},
          {src: `${geogirafeSource}/styles/*.css`, dest: 'styles/'},
          {src: `${geogirafeSource}/assets/*`, dest: ''},
          {src: `${geogirafeSource}/tools/auth/silentlogincallback.html`, dest: ''},
          {src: 'node_modules/tabulator-tables/dist/css/tabulator.min.css', dest: 'lib/tabulator-tables/'},
          {src: 'node_modules/tippy.js/dist/*.css', dest: 'lib/tippy.js/'},
          {src: 'node_modules/vanilla-picker/dist/*.css', dest: 'lib/vanilla-picker/'},
        ],
      }),
      // This second usage of viteStaticCopy is dedicated to the library.
      // It copies the files that should be copied when using the library only
      // For example to override default icons or to defined custom styles
      // But as those file do not have to exist, we ignore errors (silent=true)
      viteStaticCopy({
        targets: [
          {src: `${geogirafeSource}/templates/public/about.json`, dest: ''},
          {src: `src/styles/*.css`, dest: 'styles/'},
          {src: `src/assets/*`, dest: ''},
        ],
        silent: true,
      }),
      InlineTemplatesPlugin(),
      HtmlRebuildPlugin(),
      createHtmlPlugin({
        minify: true,
      }),
      analyzer &&
        mode === 'analyze' &&
        // https://www.npmjs.com/package/vite-bundle-analyzer
        analyzer({
          analyzerMode: 'static',
          openAnalyzer: true,
          defaultSizes: 'brotli', // or "gzip"
          summary: true,
        }),
    ],
    define: {
      // Define relative base path in cesium for loading assets
      // https://vitejs.dev/config/shared-options.html#define
      CESIUM_BASE_URL: JSON.stringify(cesiumBaseUrl),
    },
  };
});
