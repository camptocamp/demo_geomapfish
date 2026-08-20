## Upgrade

```
# Have a clear repository
git reset --hard

# Have a clear scaffold (current version)
rm --recursive --force geogirafe/CONST_scaffold
npm init @geogirafe/template@latest geogirafe/CONST_scaffold
rm --recursive --force geogirafe/CONST_scaffold/public/mock
rm --recursive --force geogirafe/CONST_scaffold/node_modules
rm geogirafe/CONST_scaffold/package-lock.json
mv geogirafe/CONST_scaffold/public/config.json geogirafe/CONST_scaffold/src/
mv geogirafe/CONST_scaffold/public/config.mobile.json geogirafe/CONST_scaffold/src/
mkdir --parent geogirafe/CONST_scaffold/src/images/logo/
mv geogirafe/CONST_scaffold/public/favicon.ico geogirafe/CONST_scaffold/src/images/
mv geogirafe/CONST_scaffold/public/images/logo/apple-touch-icon-*.png geogirafe/CONST_scaffold/src/images/logo/
mv geogirafe/CONST_scaffold/public/images/logo/favicon-*.png geogirafe/CONST_scaffold/src/images/logo/
mv geogirafe/CONST_scaffold/public/images/logo/*.svg geogirafe/CONST_scaffold/src/images/logo/
mv geogirafe/CONST_scaffold/public/images/world.webp geogirafe/CONST_scaffold/src/images/
git add --all geogirafe/CONST_scaffold

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
git apply  --directory=geogirafe --reject upgrade.patch
# Apply the *.rej files
rm upgrade.patch
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
