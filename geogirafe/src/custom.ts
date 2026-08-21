/**
 * This example creates a GeoGirafe application, including only the components you want.
 * This is for advanced usage of the GeoGirage library, when you really want to choose which part of the application should be loaded.
 *
 * If you prefer a more standard usage, please see the example described in <main.ts>.
 *
 **/

import {SplashScreen} from '@geogirafe/lib-geoportal/tools';
import {GeoGirafeApp} from '@geogirafe/lib-geoportal/core';
import {
  BasemapComponent,
  CoordinateComponent,
  MapComponent,
  MenuButtonComponent,
  ScaleComponent,
  SearchComponent,
} from '@geogirafe/lib-geoportal/components';

/**
 * Define a custom GeoGirafeApp by extending the default Application class,
 * and overriding the needed methods
 */
export default class MyCustomGeoGirafeApp extends GeoGirafeApp {
  protected override initializeInterface() {
    /**
     * This method allows you to execute some code to initialize the custom application.
     * For example, you can put here custom code to initialize custom singletons, workers,
     * or to initialize librairies.
     */
  }

  protected override defineCoreComponents() {
    /**
     * This method allows you to define the components you want to make available in your GeoGirafe Application.
     */
    customElements.define('girafe-basemap', BasemapComponent);
    customElements.define('girafe-coordinate', CoordinateComponent);
    customElements.define('girafe-map', MapComponent);
    customElements.define('girafe-menu-button', MenuButtonComponent);
    customElements.define('girafe-scale', ScaleComponent);
    customElements.define('girafe-search', SearchComponent);
  }
}

// Display the splash-screen
const splash = new SplashScreen();
splash.begin();

// Create the new Custom GeoGirafe Application
const myCustomGirafeApp = new MyCustomGeoGirafeApp();

// Wait until the application is ready
myCustomGirafeApp.isReady().then(() => {
  // Remove the splash-screen
  splash.end();
});
