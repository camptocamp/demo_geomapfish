# The renovate interface

The renovate interface is the desktop, mobile and iframe_api interfaces from ngeo that uses the
ngeo library directly (renovated).

## Development

The server application should be started previously, see the documentation from the main README.

To start the development server, run:

```bash
npm install
npm run dev
```

Open the application in your browser at [http://localhost:3002/static-frontend/desktop.html](http://localhost:3002/static-frontend/desktop.html), fir the desktop interface.

## Integration in the application

- [Build in the config image](https://github.com/camptocamp/demo_geomapfish/blob/standalone-ngeo-ui-sbr/Dockerfile#L92C1-L101C38).
- [Put the files in the `/etc/static-frontend/` folder](https://github.com/camptocamp/demo_geomapfish/blob/standalone-ngeo-ui-sbr/Dockerfile#L111C8-L111C29).
- The interfaces declaration [desktop](https://github.com/camptocamp/demo_geomapfish/blob/standalone-ngeo-ui-sbr/geoportal/vars.yaml#L51-L53), [mobile](https://github.com/camptocamp/demo_geomapfish/blob/standalone-ngeo-ui-sbr/geoportal/vars.yaml#L55-L57) and [iframe_api](https://github.com/camptocamp/demo_geomapfish/blob/standalone-ngeo-ui-sbr/geoportal/vars.yaml#L45-L47).
- The interfaces configuration [desktop](https://github.com/camptocamp/demo_geomapfish/blob/standalone-ngeo-ui-sbr/geoportal/vars.yaml#L373-L379), [mobile](https://github.com/camptocamp/demo_geomapfish/blob/standalone-ngeo-ui-sbr/geoportal/vars.yaml#L495-L497) and [iframe_api](https://github.com/camptocamp/demo_geomapfish/blob/standalone-ngeo-ui-sbr/geoportal/vars.yaml#L503-L504).
- The Interfaces should also be created in the admin interface.

## Build details

- [Alias required by ngeo](https://github.com/camptocamp/demo_geomapfish/blob/standalone-ngeo-ui-sbr/ui/vite.config.js#L41-L45).
- [Alias created to reduce the build size](https://github.com/camptocamp/demo_geomapfish/blob/standalone-ngeo-ui-sbr/ui/vite.config.js#L47-L62).

## Interfaces

- The `desktop` interface is the `desktop alt` interface with more tools.
- The `mobile` interface is the standard `mobile` interface.
- The `iframe_api` interface is the standard `iframe_api` interface.
