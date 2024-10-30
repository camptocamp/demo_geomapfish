import {TemplateResult, html} from 'lit';
import {customElement} from 'lit/decorators.js';

// @ts-ignore
@customElement('swisscom-heatmap-button')
export default class ToolButtonSwisscomHeatmap extends (window as any).gmfapi.elements.ToolButtonElement {
  constructor() {
    super('swisscom-heatmap');
  }

  render(): TemplateResult {
    return html`
      <button
        @click=${() => this.click_()}
        class="btn btn-default ${this.active_ ? 'active' : ''}"
        title="Swisscom heatmap"
      >
        <span class="fa fa-walking"></span>
      </button>
    `;
  }
}
