/**
 * This example creates a default GeoGirafe application, including all the standard configuration from GeoGirafe.
 * You will be able to use all the standard components just by adding them in your html file like this for example:
 *
 * <girafe-about></girafe-about>
 *
 * If you prefer to be more specific a have more control on which component you want to integrate in your application,
 * please see the example described in <custom.ts>.
 *
 **/

import {initializeGeoGirafeCustomStyles, redirectTo, SplashScreen} from '@geogirafe/lib-geoportal/tools';
import {GeoGirafeApp} from '@geogirafe/lib-geoportal/core';

/**
 * MyFirstComponent is an example of how to define a custom component in GeoGirafe.
 */
import MyFirstComponent from './components/my-first-component/component';
/**
 * MyExtendedComponent is an example of how to extend an existing component in GeoGirafe.
 */
import MyExtendedComponent from './components/my-extended-component/component';

// Redirect to mobile interface if we are on mobile
if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('Android')) {
  const redirectUrl = document.querySelector('meta[name=redirect-url]')?.getAttribute('content');
  if (redirectUrl) {
    redirectTo(redirectUrl);
  }
}

// Display the splash-screen
const splash = new SplashScreen();
splash.begin();

// Manage custom css overrides for core components (if any)
initializeGeoGirafeCustomStyles();

// Create the new GeoGirafe Application
const girafeApp = new GeoGirafeApp();

// Wait until the application is ready
girafeApp.isReady().then(() => {
  // Define custom components
  customElements.define('my-first-component', MyFirstComponent);
  customElements.define('my-extended-component', MyExtendedComponent);

  // Remove the splash-screen
  splash.end();
  // Start the onboarding tour
  girafeApp.context.onBoardingManager.start();
});
