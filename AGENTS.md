# demo_geomapfish

Demo application for [GeoMapFish](https://doc.geomapfish.dev), used as the test ground for the
`prod-x-y` versions of the product and for the CI of the whole chain
(ngeo -> c2cgeoportal -> demo_geomapfish -> argocd-gs-gmf-apps).

## Layout

- `geoportal/` the Python/Pyramid application, `geoportal/vars.yaml` is the main configuration
  (interfaces, layers, checkers, Content Security Policy, ...).
- `ui/` the web components based interfaces (`desktop_renovated`, `mobile_renovated`, ...), built with Vite.
- `geogirafe/` the [GeoGirafe](https://doc.geogirafe.org) interfaces (`desktop_geogirafe`,
  `mobile_geogirafe`, `iframe_api_geogirafe`), built with Vite into `/static-frontend/geogirafe/`.
- `webcomponents/`, `print/`, `print4/`, `mapserver/`, `qgisserver/`, `tilegeneration/`, `haproxy/`.
- `CONST_create_template/` and `CONST_scaffold/` copies are references from the upstream templates, they are
  used to compute the upgrade patches, never edit them by hand, only regenerate them.

## GeoGirafe

Read `geogirafe/README.md` before touching anything in `geogirafe/`, it contains the upgrade procedure.

The GeoGirafe application is only built by the Docker image, no CI job runs it in a browser, so a version bump
of one of its dependencies can silently break the whole interface. The checks
`test_geogirafe_application` and `test_geogirafe_static_asset` in `tests/test_app.py` are the guard, they are
run by `make acceptance`: extend them instead of removing them when something changes.

Traps already met (all of them broke the demo silently):

- `@geogirafe/lib-geoportal` >= 1.1 needs the page content to be wrapped in a `<girafe-app>` component,
  otherwise the application throws `Application GeoGirafe not found` and only the splash screen is displayed.
  The same requirement appears in `geogirafe/CONST_scaffold/*.html`.
- `vite-plugin-static-copy` >= 4 always keeps the source directory structure, so each target needs
  `rename: {stripBase: <number of leading directories to drop>}`, else `styles/`, `icons/`, `i18n/`, `lib/`,
  `service-worker.js` and `silentlogincallback.html` are copied below a `node_modules/...` path and are never
  found at runtime (no translation, no icon, no authentication, no offline maps).
- The search configuration is `search.providers: [{type: "geomapfish", url: ...}]` since
  `@geogirafe/lib-geoportal` 1.2, and the URL must be absolute (the library builds it with `new URL(url)`).
- The `interface=` parameter of the `themes` and `search` URLs must be exactly the interface name declared in
  `geoportal/vars.yaml`, a wrong name returns an empty theme list without any error.
- The 3D map shows a blank white globe, without any error, when `map3d` of `geogirafe/src/config.json` has no
  terrain/imagery/tileset, or when the hosts of these URLs are missing from the `img-src` and the `connect-src`
  of the Content-Security-Policy of the `*_geogirafe` interfaces in `geoportal/vars.yaml`.
- `cesium`, `ol`, `olcs`, `ol-ext`, `ol-mapbox-style`, `proj4`, `@geoblocks/print` and
  `@geoblocks/mapfishprint` are peer dependencies of the library: keep them pinned in
  `geogirafe/package.json`, they are needed for the 3D map and for a reproducible build.
- The library is published with a `latest` tag pointing to development versions: pin an explicit stable
  version, and use the `@geogirafe/create-template` version published at the same date.
- `geogirafe/` reaches the Docker image through the allow list of `.dockerignore` (`*` then `!geogirafe/...`
  lines): every file added at the root of `geogirafe/`, and every new Vite input of `vite.config.js`, must be
  whitelisted there, else the Docker build dies with
  `[UNRESOLVED_ENTRY] Cannot resolve entry module custom.html` while the local build passes.

To verify a change without building the whole Docker stack:

```shell
cd geogirafe && rm --recursive --force node_modules dist
npm install --ignore-scripts
npm run build -- --base=/static-frontend/geogirafe/
```

then serve `dist/app` below the `/static-frontend/geogirafe/` prefix and load it in a browser: the console must
be empty, except the service worker error when the page is served over HTTP.

To verify the Docker part only (the `.dockerignore` allow list and the image layout), in about two minutes:

```shell
podman build --target=geogirafe-build .
podman run --rm --entrypoint=ls <image id> /app/dist/app
```
