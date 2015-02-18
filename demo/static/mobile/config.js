/*
 * This file represents the customization point for the application integrator.
 *
 * After execution of this script an OpenLayers map filled with layers should
 * be available in App.map.
 *
 * This file also contains translations for the application strings.
 */

OpenLayers.Lang.setCode("${lang}");

var dummy = "<% from json import dumps %>";
jsonFormat = new OpenLayers.Format.JSON();
try {
    // App.info includes information that is needed by internal
    // components, such as the Login view component.
    App.info = jsonFormat.read('${dumps(info) | n}');

    App.themes = jsonFormat.read('${dumps(themes) | n}');
    App.theme = '${theme | n}';

    App.WFSTypes = jsonFormat.read('${dumps(wfs_types) | n}');

    // Query mode. Can be either 'click' or 'longpress'
    App.queryMode = 'longpress';

    App.tilesURL = jsonFormat.read('${dumps(request.registry.settings["tiles_url"]) | n}');
}
catch (e) {
}

App.featureNS = 'http://mapserver.gis.umn.edu/mapserver';

var WMTS_OPTIONS = {
    url: App.tilesURL,
    displayInLayerSwitcher: false,
    requestEncoding: 'REST',
    buffer: 0,
    transitionEffect: "resize",
    visibility: false,
    style: 'default',
    dimensions: ['TIME'],
    params: {
        'time': '2011'
    },
    matrixSet: 'c2cgp',
    //maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
    projection: new OpenLayers.Projection("EPSG:21781"),
    units: "m",
    formatSuffix: 'png',
    //serverResolutions: [1000,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5,0.25,0.1,0.05],
    serverResolutions: [156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,0.5971642833948135]
};

var WMTSASITVD_OPTIONS2 = {
    url: "http://ows.asitvd.ch/wmts/",
    displayInLayerSwitcher: false,
    requestEncoding: 'REST',
    buffer: 0,
    style: 'default',
    dimensions: ['DIM1','ELEVATION'],
    params: {
        'dim1': 'default',
        'elevation': '0'
    },
    matrixSet: "21781",
    maxExtent: new OpenLayers.Bounds(420000,30000,900000,350000),
    projection: new OpenLayers.Projection("EPSG:21781"),
    units: "m",
    format: "image/png",
    formatSuffix: 'png',
    opacity: 1,
    visibility: true,
    serverResolutions: [4000.0,3750.0,3500.0,3250.0,3000.0,2750.0,2500.0,2250.0,2000.0,1750.0,1500.0,1250.0,1000.0,750.0,650.0,500.0,250.0,100.0,50.0,20.0,10.0,5.0,2.5,2.0,1.5,1.0,0.5,0.25,0.1,0.05]
};

// define the map and layers
App.map = new OpenLayers.Map({
    fallThrough: true, // required for longpress queries
    theme: null,
    projection: 'EPSG:21781',
    extent: [529000, 147000, 555000, 161000],
    units: "m",
    resolutions: [156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,0.5971642833948135],
    controls: [
        new OpenLayers.Control.TouchNavigation({
            dragPanOptions: {
                interval: 1,
                enableKinetic: true
            }
        }),
        new OpenLayers.Control.Attribution(),
        new OpenLayers.Control.ScaleLine()
    ],
    layers: [
        new OpenLayers.Layer.WMTS(OpenLayers.Util.applyDefaults({
                name: OpenLayers.i18n('asitvd.fond_couleur'),
                ref: 'asitvd.fond_couleur',
                layer: 'asitvd.fond_couleur',
                queryLayers: [],
                transitionEffect: "resize",
                group: 'background',
                visibility: false
        }, WMTSASITVD_OPTIONS2)),
        new OpenLayers.Layer.WMTS(OpenLayers.Util.applyDefaults({
                name: OpenLayers.i18n('asitvd.fond_gris'),
                ref: 'asitvd.fond_gris',
                layer: 'asitvd.fond_gris',
                queryLayers: [],
                transitionEffect: "resize",
                group: 'background',
                visibility: false
        }, WMTSASITVD_OPTIONS2)),
        new OpenLayers.Layer.WMTS(OpenLayers.Util.applyDefaults({
            name: OpenLayers.i18n('ortho'),
            ref: 'ortho',
            layer: 'asitvd.fond_pourortho',
            opacity: 0
        }, WMTSASITVD_OPTIONS2)),
        new OpenLayers.Layer(
            OpenLayers.i18n('blank'),
            {
                isBaseLayer: true,
                ref: 'blank'
            }
        )
    ]
});
