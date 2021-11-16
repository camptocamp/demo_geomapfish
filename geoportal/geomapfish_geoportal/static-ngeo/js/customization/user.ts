import {UserModel} from 'gmfapi/store/user';

/**
 * CUSTOM
 * Set the current User's properties and state.
 * @return the custom role.
 */
UserModel.prototype.getSpecialRole = function(): string {
  return this.specialRole_;
};

/**
 * Set the current User's properties and state.
 * @param properties The new user
 * @param state The new state
 * @param specialRole A custom very special role.
 */
UserModel.prototype.setUser = function(properties: User, state: UserState, specialRole: string): void {
  const isValid = this.checkUserProperties_(properties);
  if (!isValid || state === null) {
    return;
  }
  this.state_ = state;
  this.properties_.next(properties);
  // CUSTOM part under
  this.specialRole_ = specialRole;
}
