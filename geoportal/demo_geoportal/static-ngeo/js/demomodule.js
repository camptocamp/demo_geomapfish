/**
 * This file provides the "demo" namespace, which is the
 * application's main namespace. And it defines the application's Angular
 * module.
 */

import {decodeQueryString} from 'ngeo/utils.js';

/**
 * @type {!angular.Module}
 */
const module = angular.module('demo', []);

module.config(['$compileProvider', function($compileProvider) {
  if (!('debug' in decodeQueryString(window.location.search))) {
    // Disable the debug info
    $compileProvider.debugInfoEnabled(false);
  }
}]);


export default module;
