import {TemplateResult, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import ToolButtonElement from 'gmfapi/elements/ToolButtonElement';
import 'bootstrap/js/src/tooltip';

@customElement('swisscom-heatmap-button')
export class ToolButtonSwisscomHeatmap extends ToolButtonElement {
  constructor() {
    super('swisscom-heatmap');
  }

  render(): TemplateResult {
    return html`
      <button
        @click=${() => this.click_()}
        class="btn btn-default ${this.active_ ? 'active' : ''}"
        data-toggle="tooltip"
        data-placement="left"
        data-original-title="Swisscom heatmap"
      >
        <span class="fa fa-walking"></span>
      </button>
    `;
  }
}
