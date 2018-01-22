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
goog.require('ngeo.proj.EPSG2056');
/** @suppress {extraRequire} */
goog.require('ngeo.proj.EPSG21781');


/**
 * @param {angular.Scope} $scope Scope.
 * @param {angular.$injector} $injector Main injector.
 * @constructor
 * @extends {gmf.AbstractMobileController}
 * @ngInject
 * @export
 */
demo.MobileController = function($scope, $injector) {
  gmf.AbstractMobileController.call(this, {
    autorotate: false,
    srid: 21781,
    mapViewConfig: {
      center: [632464, 185457],
      zoom: 3,
      resolutions: [250, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05]
    }
  }, $scope, $injector);

  /**
   * @type {Array.<gmf.MobileMeasurePointController.LayerConfig>}
   * @export
   */
  this.elevationLayersConfig = [
    {name: 'aster', unit: 'm'},
    {name: 'srtm', unit: 'm'}
  ];

  /**
   * @type {Array.<string>}
   * @export
   */
  this.searchCoordinatesProjections = ['EPSG:21781', 'EPSG:2056', 'EPSG:4326'];

};
ol.inherits(demo.MobileController, gmf.AbstractMobileController);


demo.module.controller('MobileController', demo.MobileController);
