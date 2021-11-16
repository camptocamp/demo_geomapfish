import * as Sentry from '@sentry/browser';
import {AuthenticationService} from 'ngeo/auth/service';
import user from 'gmfapi/store/user';

/**
 * CUSTOM
 * Set the special role to use it in the setUser_ methode.
 */
AuthenticationService.prototype.setSpecialRole = function(specialRole: string) {
  this.specialRole_ = specialRole;
}

/**
 * CUSTOM
 * Redefine setUser to add management of a specialRole;
 * @param respData Response.
 * @param userState state of the user.
 * @private
 */
AuthenticationService.prototype.setUser_ = function(respData: User, userState: UserState): void {
  Sentry.setUser({
    username: respData.username,
  });

  // CUSTOM part under
  if (!respData.username) {
    this.specialRole_ = null;
  }
  if (this.specialRole_ === undefined) {
    this.specialRole_ = localStorage.getItem('gmfUserSpecialRole');
  } else {
    localStorage.setItem('gmfUserSpecialRole', this.specialRole_);
  }
  // CUSTOM END

  user.setUser(respData, userState, this.specialRole_);
}
