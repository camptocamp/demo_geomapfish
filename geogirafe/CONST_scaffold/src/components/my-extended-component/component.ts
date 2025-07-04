import { AboutComponent } from "@geogirafe/lib-geoportal/components";

/**
 * This is an exemple how to override a web component defined in the core of GeoGirafe
 * The technical documentation of AboutComponent can be found here: 
 * https://doc.geomapfish.dev/code/classes/components_about_component.AboutComponent.html
 */

/**
 * NOTE: With the current version of GeoGirafe, 
 * It is important that the custom components are located in the directory src/components
 * Because this location is hardcoded in the build script at the moment.
 */
class MyExtendedComponent extends AboutComponent {

  /* This overrides the default template of AboutComponent */
  templateUrl = './extended.html';

  /* This overrides the default method of AboutComponent */
  async loadVersionInfos() {
    this.version = 'My-Extended-Version 1.0';
    this.build = 'My-Extended-Build 2.5';
    this.date = new Date().toISOString();
    this.render();
  }
}

export default MyExtendedComponent;
