import {customElement, state} from 'lit/decorators.js';
import {LitElement, html, css} from 'lit';

@customElement('proj-feedback')
export class ProjFeedback extends LitElement {
  @state()
  private show_send = false;
  @state()
  private permalink: string = window.location.href;
  private email: string = '';
  private email_optional: string = '';
  private feedback_text: string = '';
  private url_: string;
  private subscriptions_ = [];

  static styles = css`
    input,
    textarea {
      margin: 5px 0 5px 5px;
    }

    input {
      width: 32ch; /* 32 characters */
    }

    textarea.form-control {
      height: auto;
      width: 30ch; /* 30 characters */
    }

    .modal-title {
      color: var(--color-light);
      padding-bottom: var(--app-margin);
      margin-bottom: var(--app-margin);
      margin-top: calc(var(--grid-gutter-width) / 2);
      border-bottom-width: 0.06rem;
      border-bottom-style: solid;
      border-bottom-color: var(--color-light);
      font-size: 0.8rem;
    }

    .form-control {
      display: block;
      height: calc(1.5em + 0.5rem + 2px);
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
      font-weight: 400;
      line-height: 1.5;
      color: #495057;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid #ced4da;
      border-radius: 0;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .btn {
      display: inline-block;
      font-weight: 400;
      text-align: center;
      vertical-align: middle;
      user-select: none;
      border: 1px solid transparent;
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
      line-height: 1.5;
      border-radius: 0;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out;
    }

    .btn:not(:disabled):not(.disabled) {
      cursor: pointer;
    }

    .btn-prime {
      background-color: var(--brand-primary);
      border-color: var(--input-border-focus);
      color: white;
    }

    .btn-prime:hover {
      background-color: var(--input-border-focus);
      border-color: var(--input-border-focus-darken);
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.subscriptions_.push(
      (window as any).gmfapi.store.config.getConfig().subscribe({
        next: (configuration) => {
          if (configuration) {
            this.url_ = new URL(configuration.sitnFeedbackPath, configuration.gmfBase).href;
          }
        },
      })
    );
    window.addEventListener('popstate', () => {
      this.permalink = window.location.href;
    });
  }

  render() {
    return html`<div class="modal-header">
        <div class="modal-title">Signaler un problème</div>
      </div>
      <div class="modal-body">
        <label for="email">Votre email (optionnel):</label><br />
        <input
          input="text"
          placeholder="example@example.com"
          name="email"
          class="form-control"
          id="email"
          .value="${this.email}"
          @input=${(e) => {
            this.email = e.target.value;
          }}
        />
        <br />
        <label for="email_optional">Inclure un membre du SITN (optionnel) :</label><br />
        <input
          type="text"
          placeholder="prenom.nom@ne.ch"
          name="email_optional"
          class="form-control"
          id="email_optional"
          .value="${this.email_optional}"
          @input=${(e) => {
            this.email_optional = e.target.value;
          }}
        />
        <br />
        <label for="feedback_text"> Votre description du problème concernant la carte :</label><br />
        <textarea
          rows="4"
          cols="40"
          class="form-control"
          id="feedback_text"
          .value="${this.feedback_text}"
          @input=${(e) => {
            this.feedback_text = e.target.value;
          }}
          maxlength="1000"
          placeholder="Taille maximale: 1000 caractères"
        >
        </textarea>
        <br />
        <label for="permalink">L'URL ci-dessous sera envoyée au SITN:</label>
        <input
          type="text"
          name="permalink"
          class="form-control"
          id="permalink"
          .value="${this.permalink}"
          readonly
        />
        <br />
        Pour contacter le SITN directement:
        <a href="mailto:sitn@ne.ch?subject=Problème Géoportail">sitn@ne.ch</a>
      </div>
      <br />
      <div class="modal-footer">
        <button type="submit" class="btn btn-prime" @click="${this.feedbackSubmit}">Envoyer</button>
      </div>
      ${this.show_send
        ? html`<div class="sitn-loader">
            <div class="fas fa-spinner fa-spin"></div>
            <p>En cours d'envoi...</p>
          </div>`
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
    let params = new URLSearchParams(url.search.slice(1));
    let formdata = new FormData();
    formdata.set('permalink', this.permalink.toString());
    formdata.set('ua', navigator.userAgent);
    formdata.set('email', this.email);
    formdata.set('email_optional', this.email_optional);
    formdata.set('feedback', this.feedback_text);

    fetch(this.url_, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
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
            'Suivant votre demande, une personne du SITN prendra bientôt contact avec vous.',
          ].join('\n')
        );
      })
      .catch((error) => {
        console.error(error);
        alert('Une erreur est survenue. Merci de contacter le SITN (sitn@ne.ch)');
      });
  }
}
