/**
 * The next line imports all components and standard configuration from GeoGirafe.
 * You will be able to use all the standard components just by adding them in your html file like this for example:
 *
 * <girafe-about></girafe-about>
 *
 * If you prefer to be more specific and have more control on which component you want to integrate in your application
 * You can remove this line, integrate them individually, and define the name of the custom element
 * For example:
 *
 * import AboutComponent from './components/about/component';
 * customElements.define('girafe-about', AboutComponent);
 *
 * You will also have to do some others things manually, like:
 * - initialize the managers
 * - define the configuration of tippy, proj4, and cesium
 * - extend the standard Document and Window interfaces
 *
 * You can look here for an example: https://gitlab.com/geogirafe/gg-viewer/-/blob/main/src/main.ts
 *
 **/

import '@geogirafe/lib-geoportal/iframe';
