// The MIT License (MIT)
//
// Copyright (c) 2016-2024 Camptocamp SA
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * Application entry point.
 *
 * This file includes `import`'s for all the components/directives used
 * by the HTML page and the controller to provide the configuration.
 */

// Various fixies
// delete src/controllers/bootstrap.js webpack things and remove .vite/deps

//import './desktop_alt.scss';

import 'jquery';
import 'jquery-ui/dist/jquery-ui.js';
import angular from 'angular';
import gmfControllersAbstractDesktopController, {
  AbstractDesktopController,
} from 'ngeo/controllers/AbstractDesktopController';
import geomapfishBase from './geomapfishmodule.js';
import gmfImportModule from 'ngeo/import/module';
import gmfFloorModule from 'ngeo/floor/module';
import ngeoStreetviewModule from 'ngeo/streetview/module';
import ngeoRoutingModule from 'ngeo/routing/module';
import ngeoStatemanagerWfsPermalink from 'ngeo/statemanager/WfsPermalink';

/**
 * @private
 */
class Controller extends AbstractDesktopController {
  /**
   * @param {angular.IScope} $scope Scope.
   * @param {angular.auto.IInjectorService} $injector Main injector.
   * @ngInject
   */
  constructor($scope, $injector) {
    super($scope, $injector);

    if (this.dimensions.FLOOR == undefined) {
      this.dimensions.FLOOR = '*';
    }
  }

  /**
   * @param {JQuery.Event} event keydown event.
   */
  onKeydown(event) {}
}

/**
 * @hidden
 */
const geomapfishModule = angular.module('Appdesktop_alt', [
  geomapfishBase.name,
  gmfControllersAbstractDesktopController.name,
  gmfImportModule.name,
  gmfFloorModule.name,
  ngeoRoutingModule.name,
  ngeoStreetviewModule.name,
  ngeoStatemanagerWfsPermalink.name,
]);

geomapfishModule.controller('AlternativeDesktopController', Controller);

export default geomapfishModule;
