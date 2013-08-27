/*
 * This file represents the customization point for the application integrator.
 *
 * After execution of this script an OpenLayers map filled with layers should
 * be available in App.map.
 *
 * This file also contains translations for the application strings.
 */

OpenLayers.Lang.en = {
    "airedejeux": "Game area",
    "nom_aire": "Name",
    "toboggan_label": "Presence of slide",
    "tourniquet_label": "Presence of Tourniquet",
    "quartiers": "Districts",
    "camera": "Camera",
    // picker
    'layer_switcher.cancel': 'Cancel',
    'layer_switcher.done': 'OK'
};
OpenLayers.Lang.de = {
    "airedejeux": "Spielplatz",
    "nom_aire": "Name des Spielplatzes",
    "toboggan_label": "Rutschbahnen vorhanden",
    "tourniquet_label": "Karusell vorhanden",
    "quartiers": "Distrikte",
    "camera": "Kamera",
    // picker
    'layer_switcher.cancel': 'Cancel',
    'layer_switcher.done': 'OK',
    // redirect to standard application                                                                  
    'redirect_msg': "Vous utilisez la version mobile. Vous pouvez aussi" +                               
          " consulter la <a href='${'${url}'}'>version standard</a>.",                                     
    'close': "Fermer"
};
OpenLayers.Lang.fr = {
    "airedejeux": "Aire de jeux",
    "nom_aire": "Nom",
    "toboggan_label": "Toboggan",
    "tourniquet_label": "Tourniquet",
    "quartiers": "Quartiers",
    "camera": "Caméra",
    // picker
    'layer_switcher.cancel': 'Annuler',
    'layer_switcher.done': 'OK',
    // redirect to standard application                                                                  
    'redirect_msg': "Vous utilisez la version mobile. Vous pouvez aussi" +                               
       " consulter la <a href='${'${url}'}'>version standard</a>.",                                     
    'close': "Fermer"
};
OpenLayers.Lang.setCode("${lang}");

App.info = '${info | n}';
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

        ),
        new OpenLayers.Layer.WMS(
            "overlay",
            "${request.route_url('mapserverproxy', path='')}",
            {
                layers: ['quartiers'],
                transparent: true
            },
            {
                allLayers: ['quartiers', "camera", "airedejeux"],
                WFSTypes: ['airedejeux'],
                singleTile: true,
                ratio: 1
            }
        )
    ]
});
