// File ...static-ngeo/js/custom/helloWorld.ts;
import {html, TemplateResult, CSSResult, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import GmfBaseElement from 'gmfapi/elements/BaseElement';
import i18next from 'i18next';

@customElement('hello-world')
export default class GmfAuthForm extends GmfBaseElement {
  @property({type: String}) name = 'Not set';

  connectedCallback(): void {
    super.connectedCallback();
  }

  static styles: CSSResult[] = [
    ...GmfBaseElement.styles,
    css`
      .name {
        color: green;
      }
    `,
  ];

  protected render(): TemplateResult {
    return html`
      <div>
        <span>${i18next.t('Hello')}&nbsp;</span>
        <span class="name">${this.name}</span>
      </div>
    `;
  }
}
