// The MIT License (MIT)
//
// Copyright (c) 2016-2021 Camptocamp SA
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

import './sass/desktop.scss';
import './sass/vars_desktop.scss';

import angular from 'angular';
import {isEventUsingCtrlKey} from 'ngeo/utils';
import gmfControllersAbstractDesktopController, {
  AbstractDesktopController,
} from 'gmf/controllers/AbstractDesktopController';
import geomapfishBase from '../geomapfishmodule';
import ngeoMiscToolActivate from 'ngeo/misc/ToolActivate';
import panels from 'gmfapi/store/panels';

/**
 * @private
 */
class Controller extends AbstractDesktopController {
  constructor($scope, $injector) {
    super($scope, $injector);

    const $timeout = $injector.get('$timeout');

    // Open the 'web-component' lidar panel
    $scope.$watch(
      () => this.drawLidarprofilePanelActive,
      (newVal) => {
        if (newVal) {
          panels.openToolPanel('lidar');
        } else {
          panels.closeToolPanel();
        }
      }
    );

    // Make visible the footer
    panels.getActiveFooterPanel().subscribe({
      next: (panel) => {
        this.lidarProfileFooterActive = panel === 'lidar';
        $timeout(() => {}); // this triggered on DOM click, we call $timeout to force Angular diggest
      },
    });

    /**
     * @type {boolean}
     */
    this.drawLidarprofilePanelActive = false;

    const drawLidarprofilePanelActive = new ngeoMiscToolActivate(this, 'drawLidarprofilePanelActive');
    this.ngeoToolActivateMgr.registerTool('mapTools', drawLidarprofilePanelActive, false);
  }

  /**
   * @param {JQuery.Event} event keydown event.
   */
  onKeydown(event) {
    if (event && isEventUsingCtrlKey(event) && event.key === 'p') {
      this.printPanelActive = true;
      event.preventDefault();
    }
  }
}

/**
 * @hidden
 */
const geomapfishModule = angular.module('Appdesktop', [
  geomapfishBase.name,
  gmfControllersAbstractDesktopController.name,
]);

geomapfishModule.value('gmfContextualdatacontentTemplateUrl', 'gmf/contextualdata');
geomapfishModule.run(
  /**
   * @ngInject
   * @param {angular.ITemplateCacheService} $templateCache
   */
  ($templateCache) => {
    // @ts-ignore: webpack
    $templateCache.put('gmf/contextualdata', require('./contextualdata.html'));
  }
);

geomapfishModule.controller('DesktopController', Controller);

export default geomapfishModule;
