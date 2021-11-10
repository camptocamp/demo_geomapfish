import {html, TemplateResult, unsafeCSS} from 'lit';
import i18next from 'i18next';
import GmfAuthForm from 'ngeo/auth/FormElement';

GmfAuthForm.prototype.render = function(): TemplateResult {
  return html`
    <style>
      ${unsafeCSS(this.customCSS_)}
    </style>

    <p>Here's a custom html!</p>

    ${this.gmfUser.is_intranet
      ? html`
          <div class="form-group">
            <span>${i18next.t('You are recognized as an intranet user.')}</span>
          </div>
        `
      : ''}
    ${this.gmfUser.username !== null
      ? html`
          <div>
            <div class="form-group">
              <span>${i18next.t('Logged in as')}</span>
              <strong>${this.gmfUser.username}</strong>.
            </div>

            ${!this.changingPassword
              ? html`
                  <form name="logoutForm" role="form" @submit=${(evt: Event) => this.logout(evt)}>
                    <div class="form-group">
                      <input type="submit" class="form-control btn prime" value=${i18next.t('Logout')} />
                    </div>
                    <div class="form-group">
                      <input
                        ?hidden="${!this.allowPasswordChange}"
                        type="button"
                        class="form-control btn btn-default"
                        value=${i18next.t('Change password')}
                        @click=${() => (this.changingPassword = true)}
                      />
                    </div>
                  </form>
                `
              : ''}
          </div>
        `
      : ''}
    ${this.loginInfoMessage
      ? html`
          <div class="alert alert-warning">
            <span>${this.loginInfoMessage}</span>
          </div>
        `
      : ''}
    ${this.disconnectedShown
      ? html`
          <div class="alert alert-warning">
            ${i18next.t('You are not logged in any more. The Interface has been reloaded.')}
          </div>
        `
      : ''}
    ${this.gmfUser.username === null && !this.changingPassword
      ? html`
          <div>
            <form name="loginForm" role="form" @submit=${(evt: Event) => this.login(evt)}>
              <div class="form-group">
                <input type="text" class="form-control" name="login" placeholder=${i18next.t('Username')} />
              </div>
              <div class="form-group">
                <input
                  type="password"
                  class="form-control"
                  name="password"
                  placeholder=${i18next.t('Password')}
                />
              </div>
              ${this.twoFactorAuth
                ? html`
                    <div class="form-group">
                      ${i18next.t('The following field should be kept empty on first login:')}
                      <input
                        type="text"
                        autocomplete="off"
                        class="form-control"
                        name="otp"
                        placeholder=${i18next.t('Authentication code')}
                      />
                    </div>
                  `
                : ''}
              <div class="form-group">
                <input type="submit" class="form-control btn prime" value=${i18next.t('Connect')} />
              </div>
              ${this.isLoading
                ? html`
                    <div class="login-spinner">
                      <i class="fa fa-spin svg-lit-element"
                        >${
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                          unsafeSVG(loadingSvg)
                        }</i
                      >
                    </div>
                  `
                : ''}
              <div ?hidden="${!this.allowPasswordReset}" class="form-group">
                <a @click=${(evt: Event) => this.resetPassword(evt)} href=""
                  >${i18next.t('Password forgotten?')}</a
                >
              </div>
            </form>

            ${this.resetPasswordShown
              ? html` <div class="alert alert-info">
                  ${i18next.t('A new password has just been sent to you by e-mail.')}
                </div>`
              : ''}
          </div>
        `
      : ''}
    ${this.changingPassword
      ? html`
          <div>
            ${this.userMustChangeItsPassword
              ? html` <div class="alert alert-warning">${i18next.t('You must change your password')}</div>`
              : ''}

            <form name="changePasswordForm" role="form" @submit=${(evt: Event) => this.changePassword(evt)}>
              <div class="form-group">
                <input
                  type="password"
                  class="form-control"
                  name="oldpassword"
                  placeholder=${i18next.t('Old password')}
                />
              </div>
              <div class="form-group">
                <input
                  type="password"
                  class="form-control"
                  name="newpassword"
                  placeholder=${i18next.t('New password')}
                />
              </div>
              <div class="form-group">
                <input
                  type="password"
                  class="form-control"
                  name="newpasswordconfirm"
                  placeholder=${i18next.t('Confirm new password')}
                />
              </div>
              ${this.gmfUser.otp_uri
                ? html`
                    <div class="form-group">
                      <label>${i18next.t('Two factor authentication QR code:')}</label>
                      <div><img class="" src="${this.otpImage}" /></div>
                    </div>
                  `
                : ''}
              ${this.gmfUser.two_factor_totp_secret
                ? html`
                    <div class="form-group">
                      <label>${i18next.t('Two factor authentication key:')}</label>
                      <code>${this.gmfUser.two_factor_totp_secret}</code>
                    </div>
                  `
                : ''}
              ${this.twoFactorAuth
                ? html`
                    <div class="form-group">
                      <input
                        type="text"
                        autocomplete="off"
                        class="form-control"
                        name="otp"
                        placeholder=${i18next.t('Authentication code')}
                      />
                    </div>
                  `
                : ''}

              <div class="form-group">
                <input type="submit" class="form-control btn prime" value=${i18next.t('Change password')} />
              </div>
              <div class="form-group">
                <input
                  type="button"
                  class="form-control btn btn-default"
                  value="Cancel"
                  @click=${() => this.changePasswordReset()}
                />
              </div>
            </form>
          </div>
        `
      : ''}

    <div ?hidden="${!this.error}" class="auth-error help-block"></div>
  `;
}
