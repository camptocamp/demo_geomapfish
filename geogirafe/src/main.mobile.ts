/**
 * This example creates a default Mobile-GeoGirafe application, including all the standard configuration from GeoGirafe.
 * The principles are exactly the same as described in the desktop version (see <main.ts>).
 **/

import {initializeGeoGirafeCustomStyles, SplashScreen} from '@geogirafe/lib-geoportal/tools';
import {GeoGirafeAppMobile} from '@geogirafe/lib-geoportal/core';

// Display the splash-screen
const splash = new SplashScreen();
splash.begin();

// Manage custom css overrides for core components (if any)
initializeGeoGirafeCustomStyles();

// Create the new GeoGirafe Application
const girafeApp = new GeoGirafeAppMobile();

// Wait until the application is ready
girafeApp.isReady().then(() => {
  // Remove the splash-screen
  splash.end();
});
