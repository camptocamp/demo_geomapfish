import {customElement, state} from 'lit/decorators.js';
import {LitElement, html, css} from 'lit';

@customElement('proj-feedback')
export class ProjFeedback extends LitElement {
  @state()
  private show_modal = false;
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
    .modal-body,
    .sitn-loader,
    .modal-footer {
      background-color: #fafafa;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.subscriptions_.push(
      window.gmf.config.getConfig().subscribe({
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
        <h4
          class="modal-title"
          @click=${() => {
            this.show_modal = true;
          }}
        >
          Signaler un problème
        </h4>
        ${this.show_modal
          ? html`<button
              type="button"
              class="close"
              aria-label="Close"
              @click=${() => {
                this.show_modal = false;
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>`
          : ''}
      </div>
      ${this.show_modal
        ? html` <div class="modal-body">
              Votre email (optionnel):<br />
              <input
                input="text"
                placeholder="example@example.com"
                name="email"
                class="form-control"
                .value="${this.email}"
                @input=${(e) => {
                  this.email = e.target.value;
                }}
              />
              <br />
              Inclure un membre du SITN (optionnel) :<br />
              <input
                type="text"
                placeholder="prenom.nom@ne.ch"
                name="email_optional"
                class="form-control"
                .value="${this.email_optional}"
                @input=${(e) => {
                  this.email_optional = e.target.value;
                }}
              />
              <br />
              Votre description du problème concernant la carte :<br />
              <textarea
                rows="4"
                cols="40"
                class="form-control"
                .value="${this.feedback_text}"
                @input=${(e) => {
                  this.feedback_text = e.target.value;
                }}
                maxlength="1000"
                placeholder="Taille maximale: 1000 caractères"
              >
              </textarea>
              <br />
              L'URL ci-dessous sera envoyée au SITN:
              <input type="text" name="permalink" class="form-control" .value="${this.permalink}" readonly />
              <br />
              Pour contacter le SITN directement:
              <a href="mailto:sitn@ne.ch?subject=Problème Géoportail">sitn@ne.ch</a>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary" @click="${this.feedbackSubmit}">Envoyer</button>
            </div>`
        : ''}
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
    this.show_modal = false;
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
