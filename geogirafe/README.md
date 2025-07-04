## Upgrade

```
rm -rf CONST_scaffold
npm init @geogirafe/template@latest CONST_scaffold

git diff --relative=CONST_scaffold --staged -- CONST_scaffold > upgrade.patch

git apply --3way upgrade.patch
```

Then fix the conflicts and remove the upgrade.patch file.

### Update to last version of GeoGirafe

```
npm update @geogirafe/lib-geoportal
```

## Start the development server

```
npm start
```

## Configure and customize your instance

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

The file `custom.css` is where custom CSS can be placed.

## Develop your own components

### Your first custom component

The directory `src/components/my-first-component` contains an example on how to create a custom component for GeoGirafe.

### Extending an existing component

The directory `src/components/my-extended-component` contains an example on how to extend an existing component.

## Contact

You can join our Discord server at any time to get some help or just to discuss with us: https://discord.gg/kdrXjaqBbH.

_Have a nice journey with GeoGirafe ! :-)_
