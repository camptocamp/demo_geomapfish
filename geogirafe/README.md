## Upgrade

The `CONST_scaffold` directory is an unmodified copy of the GeoGirafe template, kept in the repository to be
able to do a diff between what upstream proposes and what we have in the demo.

Get the version numbers from <https://www.npmjs.com/package/@geogirafe/lib-geoportal?activeTab=versions> and
<https://www.npmjs.com/package/@geogirafe/create-template?activeTab=versions>, and use a template version
published together with the (stable!) library version, the `latest` tag of `@geogirafe/lib-geoportal` points to
development versions.

```
# Have a clear repository
git checkout prod-x-y
git reset --hard
git clean --interactive

# Have a clear scaffold (current version)
rm --recursive --force geogirafe/CONST_scaffold
npm init @geogirafe/template@<version> geogirafe/CONST_scaffold
rm --recursive --force geogirafe/CONST_scaffold/public/mock
rm --recursive --force geogirafe/CONST_scaffold/node_modules
rm --recursive --force geogirafe/CONST_scaffold/certs
rm geogirafe/CONST_scaffold/package-lock.json
git add --all geogirafe/CONST_scaffold
prek run --config=.pre-commit-config.yaml --all-files end-of-file-fixer trailing-whitespace prettier
git add geogirafe/CONST_scaffold

# Create a patch
git diff --relative=geogirafe/CONST_scaffold --cached HEAD -- geogirafe/CONST_scaffold \
  ':(exclude)geogirafe/CONST_scaffold/**/*.png' \
  ':(exclude)geogirafe/CONST_scaffold/**/*.ico' \
  ':(exclude)geogirafe/CONST_scaffold/**/*.webp' \
  > upgrade.patch

# Copy binary files
rsync --archive --verbose \
  --include='*/' \
  --include='*.png' --include='*.ico' --include='*.webp' \
  --exclude='*' \
  geogirafe/CONST_scaffold/ geogirafe/

# Apply the patch
git apply --directory=geogirafe --reject upgrade.patch
rm upgrade.patch
```

Then fix the conflicts (the `*.rej` files), do not keep any `*.rej` file in the repository, and remove the
leftover `upgrade.patch` file.

### Intentional differences with the template

The following points differ on purpose from the template, the patch will always reject or need a manual check
for them:

- `index.html`, `mobile.html`, `iframe.html` and `custom.html` keep a `<base href="%BASE_URL%" />` tag, because
  the application is served below `/static-frontend/geogirafe/` while the pages are served on
  `/desktop_geogirafe`, `/mobile_geogirafe` and `/iframe_api_geogirafe` by the GeoMapFish application, see the
  `interfaces` section of `geoportal/vars.yaml`.
- The configuration files are in `src/config*.json` instead of `public/config*.json`, and each interface has
  its own additional configuration file (`config.desktop.json`, `config.mobile.json`, `config.iframe.json`)
  pointing to the GeoMapFish `themes` and `search` services with its own `interface` parameter, which must be
  the name of the interface as defined in `geoportal/vars.yaml` (`desktop_geogirafe`, `mobile_geogirafe` and
  `iframe_api_geogirafe`). Rejects on `public/config*.json` are expected, the mock configuration of the
  template is not used, but do read its diff to see the new configuration keys.
- `vite.config.js` needs `rename: {stripBase: <number>}` on every `vite-plugin-static-copy` target, see the
  comment in the file, and copies more than the template (Cesium, OpenLayers, tippy.js, vanilla-picker and
  tabulator-tables).
- `public/about.json` carries the version of the library we use.

### Update to last version of GeoGirafe

```
npm update @geogirafe/lib-geoportal
```

Do not forget the peer dependencies of the library (`cesium`, `ol`, `olcs`, `ol-ext`, `ol-mapbox-style`,
`proj4`, `@geoblocks/print` and `@geoblocks/mapfishprint`), they are listed in `package.json` to have a
reproducible build.

### Verify

```
cd geogirafe
rm --recursive --force node_modules dist
npm install --ignore-scripts
npm run build -- --base=/static-frontend/geogirafe/
```

Check that `dist/app` contains the files the application expects at its root: `service-worker.js`,
`silentlogincallback.html`, `icons/`, `i18n/`, `styles/`, `lib/cesium/`, `lib/ol/`, `lib/tippy.js/`, then serve
the build and open it in a browser (a small static server with the `/static-frontend/geogirafe/` prefix in the
URL, some demo backend URLs are relative), and check that there is no error in the console, except the service
worker one if you serve it over HTTP.

`make build` + `make acceptance` also verify the pages, with the tests `test_geogirafe_application` and
`test_geogirafe_static_asset` in `tests/test_app.py`, they fail with a bad `<girafe-app>` component or bad
static asset paths.

## Start the development server

```
npm start
```

## Configure and customize your instance

### Main configuration

The file `src/config.json` contains the application configuration, `src/config.desktop.json`,
`src/config.mobile.json` and `src/config.iframe.json` add the interface specific configuration for the three
GeoMapFish interfaces.
See https://doc.geogirafe.org/docs/configuration for more configuration options.

### Themes and layers

The themes come from the GeoMapFish backend, see the `themes.url` of the interface configuration files. They are
built with QGIS from the `qgisserver` and `mapserver` directories of this repository, and the corresponding
interfaces are declared in the `interfaces` section of `geoportal/vars.yaml`.

### Main interface

The files `index.html` and `mobile.html` define your application templates.
A complete example can be found here: https://gitlab.com/geogirafe/gg-viewer/-/blob/main/index.html?ref_type=heads

### Styling

The file `custom.css` is where custom CSS can be placed.

## Develop your own components

### Your first custom component

The directory `src/components/my-first-component` contains an example on how to create a custom component for GeoGirafe.

### Extending an existing component

The directory `src/components/my-extended-component` contains an example on how to extend an existing component.

## Contact

You can join our Discord server at any time to get some help or just to discuss with us: https://discord.gg/kdrXjaqBbH.

_Have a nice journey with GeoGirafe ! :-)_
