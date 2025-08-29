
import {TemplateResult, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import ToolButtonElement from 'gmfapi/elements/ToolButtonElement';
import i18next from 'i18next';
import 'bootstrap/js/src/tooltip';


@customElement('gmf-oeedit-button')
export class ToolButtonOeedit extends ToolButtonElement {
  constructor() {
    super('oeedit');
  }

  render(): TemplateResult {
    return html`
      <button
        @click=${() => this.click_()}
        class="btn btn-default ${this.active_ ? 'active' : ''}"
        data-toggle="tooltip"
        data-placement="left"
        data-original-title="${i18next.t('Object Editing')}"
      >
        <span class="fa-solid fa-pen-to-square"></span>
      </button>
    `;
  }
}
