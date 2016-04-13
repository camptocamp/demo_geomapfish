/**
 * Application entry point.
 *
 * This file defines the "demo_mobile" Closure namespace, which is be used as the
 * Closure entry point (see "closure_entry_point" in the "build.json" file).
 *
 * This file includes `goog.require`'s for all the components/directives used
 * by the HTML page and the controller to provide the configuration.
 */
goog.provide('demo.MobileController');
goog.provide('demo_mobile');

goog.require('demo');
goog.require('gmf.AbstractMobileController');
/** @suppress {extraRequire} */
goog.require('gmf.authenticationDirective');
/** @suppress {extraRequire} */
goog.require('ngeo.proj.EPSG21781');
/** @suppress {extraRequire} */
goog.require('ngeo.mobileGeolocationDirective');

/* global demo */

demo.module.constant('ngeoQueryOptions', {
  'limit': 20
});


/**
 * @param {angular.Scope} $scope Scope.
 * @param {angular.$injector} $injector Main injector.
 * @constructor
 * @extends {gmf.AbstractMobileController}
 * @ngInject
 * @export
 */
demo.MobileController = function($scope, $injector) {
  goog.base(
      this, {
        srid: 21781,
        mapViewConfig: {
          center: [632464, 185457],
          minZoom: 3,
          zoom: 3
        }
      },
      $scope, $injector);
};
goog.inherits(demo.MobileController, gmf.AbstractMobileController);


demo.module.controller('MobileController', demo.MobileController);
