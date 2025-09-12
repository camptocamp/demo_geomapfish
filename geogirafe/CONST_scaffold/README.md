# Template Repository for GeoGirafe

## About this repository

This project is not meant to be used with `git clone`.  
Instead, it is designed as an npm template for creating a GeoGirafe application.

To create a new GeoGirafe app, use the command:  
```
npm create @geogirafe/template@latest my-geogirafe-app v0.9
```

This command initializes your project using this repository as a template, automatically generating any missing files. If you simply clone this repository, the following files will not be included:
- vite.config.js
- tsconfig.js
- index.html
- mobile.html

Therefore, if the `npm create...` command was not used, these files need to be created manually to complete the setup.

## Getting Started

### Install dependencies

```
npm install
```

### Generate SSL certificates

Some functionalities will only work with a valid SSL Certificate.  
This is a limitation of the browsers, that do not allow for example services-workers do work correctly is they are used on a non-secured website.

You can use the scripts provided by GeoGirafe to help you create this certificate, and tell the system and the browser to trust it:

On Windows:

```sh
cd my-geogirafe-app
npm run generate-dev-certs-win
```

On Linux:

```sh
cd my-geogirafe-app
npm run generate-dev-certs
```

### Start the development server

```
npm start
```

### Build for production

```
npm run build
```

### Preview production

```
npm run preview
```

### Update to last version of GeoGirafe

```
npm update @geogirafe/lib-geoportal
```

# Configure and customize your instance

### Main configuration

The file `public/config.json` contains the application configuration.  
See https://doc.geomapfish.dev/docs/configuration for more configuration options.

### Themes and layers

The file `public/mock/themes.json` contains the themes configuration.  
Consult the GeoMapFish documentation for more infos about this, or have a look at the demos for some examples :
  - https://map.geo.bs.ch/themes?background=background&interface=desktop
  - https://sitn.ne.ch/themes?background=desktop_background&interface=desktop


### Main interface

The files `index.html` and `mobile.html` define your application templates.  
A complete example can be found here: https://gitlab.com/geogirafe/gg-viewer/-/blob/main/index.html?ref_type=heads

### Styling

The file `custom.css` ist the way were custom css can be placed.

# Develop your own components

### Your first custom component

The directory `src/components/my-first-component` contains an example on how to create a custom component for GeoGirafe.

### Extending an existing component

The directory `src/components/my-extended-component` contains an example on how to extend an existing component.

# Contact

You can join our Discord server at any time to get some help or just to discuss with us: https://discord.gg/kdrXjaqBbH.

_Have a nice journey with GeoGirafe ! :-)_