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

    App.WFSTypes = '${wfs_types | n}'.split(',');

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
    projection: new OpenLayers.Projection("EPSG:3857"),
    units: "m",
    formatSuffix: 'png',
    //serverResolutions: [1000,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5,0.25,0.1,0.05],
    serverResolutions: [156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,0.5971642833948135]
};

// define the map and layers
App.map = new OpenLayers.Map({
    fallThrough: true, // required for longpress queries
    theme: null,
    projection: 'EPSG:3857',
    extent: [-466375.77628413, 5379611.8001185, 1035458.955194, 6573252.433606],
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
        new OpenLayers.Layer.OSM("OpenStreetMap", 
            [
                'http://otile1.mqcdn.com/tiles/1.0.0/osm/${"${z}/${x}/${y}"}.png',
                'http://otile2.mqcdn.com/tiles/1.0.0/osm/${"${z}/${x}/${y}"}.png',
                'http://otile3.mqcdn.com/tiles/1.0.0/osm/${"${z}/${x}/${y}"}.png'
            ], 
            {
                transitionEffect: 'resize',
                ref: 'mapquest'
            }
        ),
        new OpenLayers.Layer.OSM(
            "Cycle Map",
            [
                "http://a.tile.opencyclemap.org/cycle/${'${z}/${x}/${y}'}.png",
                "http://b.tile.opencyclemap.org/cycle/${'${z}/${x}/${y}'}.png",
                "http://c.tile.opencyclemap.org/cycle/${'${z}/${x}/${y}'}.png"
            ],
            {
                transitionEffect: 'resize',
                ref: 'opencyclemap'
            }
        ),
        new OpenLayers.Layer.OSM(
            "Transport Map",
            [
                "http://a.tile2.opencyclemap.org/transport/${'${z}/${x}/${y}'}.png",
                "http://b.tile2.opencyclemap.org/transport/${'${z}/${x}/${y}'}.png",
                "http://c.tile2.opencyclemap.org/transport/${'${z}/${x}/${y'}}.png"
            ],
            {
                transitionEffect: 'resize',
                ref: 'transport'
            }
        ),
        new OpenLayers.Layer.WMTS(OpenLayers.Util.applyDefaults({
            name: OpenLayers.i18n('ortho'),
            ref: 'ortho',
            layer: 'ortho',
            formatSuffix: 'jpeg',
            opacity: ${request.registry.settings['ortho_opacity']}
        }, WMTS_OPTIONS)),
        new OpenLayers.Layer(
            OpenLayers.i18n('blank'),
            {
                isBaseLayer: true,
                ref: 'blank'
            }
        )
    ]
});
