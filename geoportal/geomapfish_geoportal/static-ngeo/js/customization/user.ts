import {BehaviorSubject} from 'rxjs';
import {UserModel} from 'gmfapi/store/user';

/**
 * @returns the observable user's properties.
 */
UserModel.prototype.getProperties = function(): BehaviorSubject<User> {
  console.log('getProperties from stor/user is overriden!');
  return this.properties_;
}
