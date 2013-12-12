/*
 * This file represents the customization point for the application integrator.
 *
 * After execution of this script an OpenLayers map filled with layers should
 * be available in App.map.
 *
 * This file also contains translations for the application strings.
 */

OpenLayers.Lang.setCode("${lang}");

App.info = '${info | n}';
App.themes = '${themes | n}';
App.WFSTypes = '${wfs_types | n}';

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
                transitionEffect: 'resize'
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
                transitionEffect: 'resize'
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
                transitionEffect: 'resize'
            }

        )
    ]
});
