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

import './desktop.css';

import angular from 'angular';
import gmfControllersAbstractDesktopController, {
  AbstractDesktopController,
} from 'ngeo/controllers/AbstractDesktopController';
import appBase from './geomapfishmodule.js';
import gmfImportModule from 'ngeo/import/module';
import gmfFloorModule from 'ngeo/floor/module';
import ngeoStreetviewModule from 'ngeo/streetview/module';
import ngeoRoutingModule from 'ngeo/routing/module';
import ngeoStatemanagerWfsPermalink from 'ngeo/statemanager/WfsPermalink';
import '../webcomponents/index';
import {OgcApiEndpoint} from '@camptocamp/ogc-client';

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

    // const baseUrl = 'http://localhost:8090/mapserv_proxy/mapserver/MainPNG/ogcapi';
    // const ogcAPIManager = new OgcApiEndpoint(baseUrl);
    //
    // // features in the bbox
    // const bbox: [number, number, number, number] = [-6.8824, 58.1736, -6.7937, 58.2042];
    // ogcAPIManager.getCollectionItems('osm_open', 100, 0, false, undefined, bbox).then((features) => {
    //   console.log(features);
    // });

    // MapServer route: /mapserv_proxy/<ogc-server>/ogcapi/*
    fetch(
      'https://localhost:8484/mapserv_proxy/<ogc-server>/ogcapi/collections/<layer>/items?bbox=6.0,46.0,7.0,47.0&limit=100&offset=0',
    );
    fetch(
      'http://localhost:8090/mapserv_proxy/MainPNG/ogcapi/collections/osm_open/items?bbox=6.0,46.0,7.0,47.0&limit=100&offset=0&ogcserver=MainPNG',
    );

    // QGISServer route: /mapserv_proxy/<ogc-server>/wfs3/*
    fetch(
      'https://localhost:8484/mapserv_proxy/<ogc-server>/wfs3/collections/<layer-name/items?bbox=6.0,46.0,7.0,47.0&limit=100&offset=0',
    );
    fetch(
      'http://localhost:8091/mapserv_proxy/wfs3/collections/points/items?bbox=6.0,46.0,7.0,47.0&limit=100&map=/etc/qgisserver/project.qgs',
    );

    //fetch(
    //  'http://localhost:8090/mapserv_proxy/mapserver/MainPNG/ogcapi/collections/osm_open/items?bbox=2600000.0,1200000.0,2800000.0,1400000.0&limit=100&offset=0&bbox-crs=http%3A%2F%2Fwww.opengis.net%2Fdef%2Fcrs%2FEPSG%2F0%2F2056'
    //);
    //view-source:http://www.opengis.net/def/crs/EPSG/0/2056
    //fetch('https://localhost:8484/mapserv_proxy?ogcserver=Main%20PNG&bbox=-6.8824,58.1736,-6.7937,58.2042&limit=100&offset=0');
  }

  /**
   * @param {JQuery.Event} event keydown event.
   */
  onKeydown(event) {}
}

/**
 * @hidden
 */
const geomapfishModule = angular.module('Desktop', [
  appBase.name,
  gmfControllersAbstractDesktopController.name,
  gmfImportModule.name,
  gmfFloorModule.name,
  ngeoRoutingModule.name,
  ngeoStreetviewModule.name,
  ngeoStatemanagerWfsPermalink.name,
]);

geomapfishModule.controller('DesktopController', Controller);

export default geomapfishModule;
