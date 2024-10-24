import {customElement, state} from 'lit/decorators.js';
import {html, css} from 'lit';

// @ts-ignore
@customElement('proj-feedback')
export class ProjFeedback extends (window as any).gmfapi.elements.ToolPanelElement {
  @state()
  private show_send = false;
  @state()
  private permalink: string = window.location.href;
  private email: string = '';
  private email_optional: string = '';
  private feedback_text: string = '';
  private url_: string = '';
  private subscriptions_ = [];

  static styles = [
    ...(window as any).gmfapi.elements.ToolPanelElement.styles,
    css`
      .modal-footer {
        border-top: 0.06rem solid var(--color-light);
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    this.subscriptions_.push(
      (window as any).gmfapi.store.config.getConfig().subscribe({
        next: (configuration?: any) => {
          if (configuration) {
            this.url_ = new URL(configuration.sitnFeedbackPath, configuration.gmfBase).href;
          }
        },
      }),
    );
    window.addEventListener('popstate', () => {
      this.permalink = window.location.href;
    });
  }

  render() {
    return html`${this.getTitle('Signaler un problème')} <label for="email">Votre email</label><br />
      <input
        input="text"
        placeholder="example@example.com"
        name="email"
        class="form-control"
        id="email"
        .value="${this.email}"
        @input=${(e: any) => {
          this.email = e.target.value;
        }}
      />
      <br />
      <label for="email_optional">Inclure une personne en CC</label><br />
      <input
        type="text"
        placeholder="prenom.nom@ne.ch"
        name="email_optional"
        class="form-control"
        id="email_optional"
        .value="${this.email_optional}"
        @input=${(e: any) => {
          this.email_optional = e.target.value;
        }}
      />
      <br />
      <label for="feedback_text">Votre description du problème concernant la carte *</label><br />
      <textarea
        rows="4"
        cols="40"
        class="form-control"
        id="feedback_text"
        .value="${this.feedback_text}"
        @input=${(e: any) => {
          this.feedback_text = e.target.value;
        }}
        maxlength="1000"
        placeholder="Maximum 1000 caractères"
      >
      </textarea>
      <br />
      <label for="permalink">L'URL ci-dessous sera envoyée</label>
      <input
        type="text"
        name="permalink"
        class="form-control"
        id="permalink"
        .value="${this.permalink}"
        readonly
      />
      <br />
      <button type="submit" class="btn prime" @click="${this.feedbackSubmit}">Envoyer</button>
      ${this.show_send
        ? html`
            <div class="fas fa-spinner fa-spin"></div>
            En cours d'envoi...
          `
        : ''}`;
  }

  private feedbackSubmit() {
    if (
      (this.email && this.email.indexOf('@') === -1) ||
      (this.email_optional && this.email_optional.indexOf('@') === -1)
    ) {
      alert("Une adresse email n'est pas valide");
      return;
    }

    if (!this.feedback_text) {
      alert('Veuillez saisir une descritption du problème.');
      return;
    }

    if (this.feedback_text.length > 1000) {
      alert('Votre texte est trop long (max 1000 caractères).');
      return;
    }
    this.show_send = true;

    let url = new URL(this.url_);
    let formdata = new FormData();
    formdata.set('permalink', this.permalink.toString());
    formdata.set('ua', navigator.userAgent);
    formdata.set('email', this.email);
    formdata.set('email_optional', this.email_optional);
    formdata.set('feedback', this.feedback_text);

    fetch(this.url_, {
      method: 'POST',
      body: formdata,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.statusText} (${response.status})`);
        }
        this.show_send = false;
        alert(
          [
            'Merci! Votre demande est bien partie.',
            '',
            'Suivant votre demande, une personne prendra bientôt contact avec vous.',
          ].join('\n'),
        );
        (window as any).gmfapi.store.panels.closeToolPanel();
      })
      .catch((error) => {
        console.error(error);
        alert('Une erreur est survenue.');
        this.show_send = false;
      });
  }
}
