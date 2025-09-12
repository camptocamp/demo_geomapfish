import { GirafeHTMLElement } from "@geogirafe/lib-geoportal/base";

/**
 * This is an exemple how to define a web component based on GeoGirafe
 * Note that you do not have to extend GirafeHTMLElement here.
 * It makes the job easier, because everything will be ready for the integration in a GeoGirafe application
 * Like for exemple access to the state, translations, templating, styling, ...
 * But you don't have to. If you prefer, you can extent the standard HTMLElement. 
 * In this case, you will just have a bit more work to integrate it in the GeoGirafe world.
 */

/**
 * NOTE: With the current version of GeoGirafe, 
 * It is important that the custom components are located in the directory src/components
 * Because this location is hardcoded in the build script at the moment.
 */
class MyFirstComponent extends GirafeHTMLElement {
  templateUrl = './template.html';
  styleUrl = './style.css';

  east: string = '';
  north: string = '';

  constructor() {
    /* Give a unique name to your component. */
    super('my-first-component');
  }

  registerEvents() {
    /** 
     * Listen to any change of the selectedTheme property in the state 
     * https://gitlab.com/geogirafe/gg-viewer/-/blob/main/src/tools/state/state.ts?ref_type=heads#L75
     * And rerender the component when this property changes
     */
    this.stateManager.subscribe('mouseCoordinates', (_oldCoordinates: number[], newCoordinates: number[]) =>
      this.onChangeCoordinates(newCoordinates)
    );
  }

  onChangeCoordinates(coord: number[]) {
    /* Format coordinates */
    this.east = coord[0].toLocaleString();
    this.north = coord[1].toLocaleString();
    /* Rerender the component */
    super.render();
  }

  connectedCallback() {
    this.loadConfig().then(() => {
      /* Render the component */
      super.render();
      /* Apply translations */
      super.girafeTranslate();
      /* Listen to state changes */
      this.registerEvents();
    });
  }
}

export default MyFirstComponent;
