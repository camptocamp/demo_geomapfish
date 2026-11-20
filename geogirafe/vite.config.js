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
 * so the default dns lookup method is overridden
 * to resolve app.localhost to 127.0.0.1
 */
const originalDnsLookup = dns.lookup;
function customDnsLookup(hostname, arg1, arg2) {
  const callback = typeof arg1 === 'function' ? arg1 : arg2;
  const options = typeof arg1 === 'function' ? undefined : arg1;
  if (hostname === 'app.localhost') {
    callback(null, '127.0.0.1', 4);
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

/**
 * Since vite-plugin-static-copy v4 the directory structure of the source is always preserved, so every
 * target needs a `rename: {stripBase: <number of leading directory segments to drop>}` to land at the path
 * expected by the application (the library and our HTML reference the files at the root of the app:
 * `icons/`, `i18n/`, `styles/`, `lib/`, `service-worker.js`, ...).
 * The number is the count of directories of the matched path relative to the project root, up to (and
 * including) the ones that must not appear in the destination, `dest` being prepended to the rest.
 * For example `node_modules/@geogirafe/lib-geoportal/styles/splash.css` has 4 directories, and with
 * `dest: 'styles/'` all 4 must be dropped to get `styles/splash.css`.
 */

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
          codeSplitting: {
            groups: [
              // Dependencies that the application needs on startup and on which Cesium also depends
              // (OpenLayers and dompurify). They need their own chunk, otherwise they end up in the
              // (huge) cesium chunk, which would then have to be loaded on startup and would defeat
              // the lazy loading of Cesium below.
              // minSize: 0 prevents the group from being merged back into another chunk.
              {
                name: 'shared',
                test: (id) => ['dompurify', 'ol'].some((dep) => id.includes(`node_modules/${dep}/`)),
                priority: 30,
                minSize: 0,
              },
              // lazy loading for cesium dependencies
              {
                name: 'cesium',
                test: (id) => ['cesium', 'olcs/OLCesium'].some((dep) => id.includes(`node_modules/${dep}`)),
                priority: 20,
                minSize: 0,
              },
              // lazy loading for not priority libraries
              {
                name: 'lazy',
                test: (id) =>
                  [
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
                  ].some((dep) => id.includes(`node_modules/${dep}`)),
                priority: 10,
                minSize: 0,
              },
            ],
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
          // node_modules/cesium/Build/Cesium/<dir>/... -> lib/cesium/<dir>/...
          ...['ThirdParty', 'Workers', 'Assets', 'Widgets'].map((dir) => ({
            src: `${cesiumSource}/${dir}/**`,
            dest: cesiumBaseUrl,
            rename: {stripBase: 4},
          })),
          // node_modules/@geogirafe/lib-geoportal/tools/sw/<file>.js -> <file>.js
          {
            src: `${geogirafeSource}/tools/sw/*.js`,
            dest: '',
            rename: {stripBase: 5},
          },
          // node_modules/@geogirafe/lib-geoportal/tools/auth/<file>.html -> <file>.html
          {
            src: `${geogirafeSource}/tools/auth/silentlogincallback.html`,
            dest: '',
            rename: {stripBase: 5},
          },
          // node_modules/@geogirafe/lib-geoportal/styles/<file>.css -> styles/<file>.css
          {
            src: `${geogirafeSource}/styles/*.css`,
            dest: 'styles/',
            rename: {stripBase: 4},
          },
          // node_modules/@geogirafe/lib-geoportal/assets/icons/<file>.svg -> icons/<file>.svg
          // node_modules/@geogirafe/lib-geoportal/assets/i18n/<file>.json -> i18n/<file>.json
          {
            src: `${geogirafeSource}/assets/**`,
            dest: '',
            rename: {stripBase: 4},
          },
          {src: 'node_modules/ol/ol.css', dest: 'lib/ol/', rename: {stripBase: 2}},
          {src: 'node_modules/tippy.js/dist/*.css', dest: 'lib/tippy.js/', rename: {stripBase: 3}},
          {
            src: 'node_modules/vanilla-picker/dist/*.css',
            dest: 'lib/vanilla-picker/',
            rename: {stripBase: 3},
          },
          {
            src: 'node_modules/tabulator-tables/dist/css/tabulator.min.css',
            dest: 'lib/tabulator-tables/',
            rename: {stripBase: 4},
          },
        ],
      }),
      // This second usage of viteStaticCopy is dedicated to the library.
      // It copies the files that should be copied when using the library only
      // For example to override default icons or to defined custom styles
      // But as those file do not have to exist, we ignore errors (silent=true)
      // The about.json of the library is not copied, we keep our own one from public/
      viteStaticCopy({
        targets: [
          {src: `src/styles/*.css`, dest: 'styles/', rename: {stripBase: 2}},
          {src: `src/assets/**`, dest: '', rename: {stripBase: 2}},
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
