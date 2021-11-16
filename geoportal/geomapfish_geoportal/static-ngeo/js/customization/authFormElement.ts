import {unsafeCSS, html, TemplateResult} from 'lit';
import i18next from 'i18next';
import authenticationService from 'ngeo/auth/service';
import ngeoAuthForm from 'ngeo/auth/FormElement';
import user from 'gmfapi/store/user';



/**
 * CUSTOM
 * Get custom special role from the user's model.
 */
ngeoAuthForm.prototype.getSpecialRole_ = function(): string {
  return user.getSpecialRole();
}

/**
 * Calls the authentication service login method.
 * CUSTOM: manage special role.
 * @param evt Event from the form submit action.
 */
ngeoAuthForm.prototype.login = function(evt: Event): void {
  evt.preventDefault();

  this.manualLoginLogout_();

  this.isLoading = true;
  const errors = [];
  const form = evt.target as HTMLFormElement;
  const loginVal = (form.login as HTMLInputElement).value;
  const pwdVal = (form.password as HTMLInputElement).value;

  if (loginVal === '') {
    errors.push(i18next.t('The username is required.'));
  }
  if (pwdVal === '') {
    errors.push(i18next.t('The password is required.'));
  }
  if (errors.length) {
    this.isLoading = false;
    this.setError_(errors);
  } else {
    // CUSTOM
    authenticationService.setSpecialRole(form.specialRole.value);
    // CUSTOM END
    authenticationService
      .login(loginVal, pwdVal)
      .then(() => {
        this.resetError_();
      })
      .catch(() => {
        this.setError_([i18next.t('Incorrect credentials or disabled account.')]);
      })
      .finally(() => {
        this.isLoading = false;
        form.reset();
      });
  }
}

/**
 * Render the HTML
 * CUSTOM: Manage special role (new input, new feedback once logged in).
 */
ngeoAuthForm.prototype.render = function(): TemplateResult {
  // CUSTOM
  this.customCSS_ = `
    ${this.customCSS_}
    strong {
      text-shadow: 1px 1px 2px black;
    }
  `
  // CUSTOM END
  return html`
    <style>
      ${unsafeCSS(this.customCSS_)}
    </style>

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
            <!-- CUSTOM -->
            <div class="form-group">
              <span>${i18next.t('With special role')}</span>
              <strong>${this.getSpecialRole_()}</strong>.
            </div>
            <!-- CUSTOM END -->
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
              <!-- CUSTOM -->
              <div class="form-group">
                <input
                  type="text"
                  class="form-control"
                  name="specialRole"
                  placeholder=${i18next.t('Special role')}
                />
              </div>
              <!-- CUSTOM END -->
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
                      <i class="fa fa-spin svg-lit-element"> ${unsafeSVG(loadingSvg)} </i>
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
