# The renovate interface

The renovate interface is the desktop, mobile and iframe_api interfaces from ngeo that uses the
ngeo library directly (renovated).

This `ui` folder has been created manually. It's using ngeo as base library but any kind of UI interface can
be integrated.

## Development

The server application should be started previously, see the documentation from the main README.

To start the development server, run:

```bash
npm install
npm run dev
```

Open the application in your browser at [https://localhost:3002/static-frontend/desktop.html](https://localhost:3002/static-frontend/desktop.html), fir the desktop interface.

## Integration in the application

- [Build in the config image](https://github.com/camptocamp/demo_geomapfish/blob/70ee2a0d4f2e265dc44d8da57f7e42dc9d09ff8c/Dockerfile#L93-L101).
- [Put the files in the `/etc/static-frontend/` folder](https://github.com/camptocamp/demo_geomapfish/blob/70ee2a0d4f2e265dc44d8da57f7e42dc9d09ff8c/Dockerfile#L111).
- The interfaces declaration [desktop](https://github.com/camptocamp/demo_geomapfish/blob/70ee2a0d4f2e265dc44d8da57f7e42dc9d09ff8c/geoportal/vars.yaml#L51-L53), [mobile](https://github.com/camptocamp/demo_geomapfish/blob/70ee2a0d4f2e265dc44d8da57f7e42dc9d09ff8c/geoportal/vars.yaml#L55-L57) and [iframe_api](https://github.com/camptocamp/demo_geomapfish/blob/70ee2a0d4f2e265dc44d8da57f7e42dc9d09ff8c/geoportal/vars.yaml#L45-L47).
- The interfaces configuration [desktop](https://github.com/camptocamp/demo_geomapfish/blob/70ee2a0d4f2e265dc44d8da57f7e42dc9d09ff8c/geoportal/vars.yaml#L373-L381), [mobile](https://github.com/camptocamp/demo_geomapfish/blob/70ee2a0d4f2e265dc44d8da57f7e42dc9d09ff8c/geoportal/vars.yaml#L497-L499) and [iframe_api](https://github.com/camptocamp/demo_geomapfish/blob/70ee2a0d4f2e265dc44d8da57f7e42dc9d09ff8c/geoportal/vars.yaml#L505-L506).
- The Interfaces should also be created in the admin interface.

## Build details

- [Alias required by ngeo](https://github.com/camptocamp/demo_geomapfish/blob/70ee2a0d4f2e265dc44d8da57f7e42dc9d09ff8c/ui/vite.config.js#L47-L51).
- [Alias created to reduce the build size](https://github.com/camptocamp/demo_geomapfish/blob/70ee2a0d4f2e265dc44d8da57f7e42dc9d09ff8c/ui/vite.config.js#L53-L68).

## Interfaces

- The `desktop` interface is the `desktop alt` interface with more tools.
- The `mobile` interface is the standard `mobile` interface.
- The `iframe_api` interface is the standard `iframe_api` interface.
