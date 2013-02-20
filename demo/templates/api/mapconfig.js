<%doc>
This file defines map config for both the Simple and the
Extended APIs.
</%doc>

        var WMTS_OPTIONS = {
% if not tilecache_url:
            url: "${request.route_url('tilecache', path='')}",
% else:
            url: '${tilecache_url}',
% endif
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
            serverResolutions: [156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,0.5971642833948135],
            getMatrix: function() {
                return {
                    identifier: OpenLayers.Util.indexOf(
                                    this.serverResolutions,
                                    this.map.getResolution())
                };
            }
        };

        var INITIAL_EXTENT = [-466375.77628413, 5379611.8001185, 1035458.955194, 6573252.433606]; 
        var RESTRICTED_EXTENT = [-666375.77628413, 3379611.8001185, 1235458.955194, 7573252.433606];

        var mapConfig = {
            xtype: 'cgxp_mappanel',
            projection: "EPSG:3857",
            extent: INITIAL_EXTENT,
            maxExtent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
            //restrictedExtent: RESTRICTED_EXTENT,
            stateId: "map",
            projection: new OpenLayers.Projection("EPSG:3857"),
            units: "m",
            resolutions: [156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,0.5971642833948135],
            controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.PanZoomBar({panIcons: false}),
                new OpenLayers.Control.ArgParser(),
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.ScaleLine({
                    bottomInUnits: false,
                    bottomOutUnits: false
                }),
                new OpenLayers.Control.LayerSwitcher(),
                /*
                new OpenLayers.Control.OverviewMap({
                    size: new OpenLayers.Size(200, 100),
                    layers: [new OpenLayers.Layer.OSM("OSM", [
                           'http://otile1.mqcdn.com/tiles/1.0.0/osm/${"${z}/${x}/${y}"}.png',
                           'http://otile2.mqcdn.com/tiles/1.0.0/osm/${"${z}/${x}/${y}"}.png',
                           'http://otile3.mqcdn.com/tiles/1.0.0/osm/${"${z}/${x}/${y}"}.png'
                        ], {
                            transitionEffect: 'resize',
                            attribution: [
                                "(c) <a href='http://openstreetmap.org/'>OSM</a>",
                                "<a href='http://creativecommons.org/licenses/by-sa/2.0/'>by-sa</a>"
                            ].join(' ')
                        }
                    )],
                    mapOptions: {
                        theme: null,
                        numZoomLevels: 1
                    }
                }),
                */
                new OpenLayers.Control.MousePosition({numDigits: 0})
            ],
            layers: [
            {
               source: "olsource",
               type: "OpenLayers.Layer.WMTS",
               group: 'background',
               args: [OpenLayers.Util.applyDefaults({
                   name: OpenLayers.i18n('plan'),
                   mapserverLayers: 'plan',
                   ref: 'plan',
                   layer: 'plan',
                   group: 'background',
                   displayInLayerSwitcher: true
               }, WMTS_OPTIONS)]
           },
           {
		source: "olsource",
                type: "OpenLayers.Layer.OSM",
                group: 'background',
                args: [
                    OpenLayers.i18n('OSM_MapQuest'), 
                    [
                       'http://otile1.mqcdn.com/tiles/1.0.0/osm/${"${z}/${x}/${y}"}.png',
                       'http://otile2.mqcdn.com/tiles/1.0.0/osm/${"${z}/${x}/${y}"}.png',
                       'http://otile3.mqcdn.com/tiles/1.0.0/osm/${"${z}/${x}/${y}"}.png'
                   ], {
                       transitionEffect: 'resize',
                       attribution: [
                           "(c) <a href='http://openstreetmap.org/'>OSM</a>",
                           "<a href='http://creativecommons.org/licenses/by-sa/2.0/'>by-sa</a>"
                       ].join(' '),
                       group: 'background',
                       ref: 'OSM_MapQuest'
                    }
                ]
            },
            {
                source: "olsource",
                type: "OpenLayers.Layer.WMTS",
                args: [OpenLayers.Util.applyDefaults({
                    name: OpenLayers.i18n('ortho'),
                    mapserverLayers: 'ortho',
                    ref: 'ortho',
                    layer: 'ortho',
                    formatSuffix: 'jpeg',
                    opacity: 0.5,
                    displayInLayerSwitcher: true
                }, WMTS_OPTIONS)]
            },
            {
                source: "olsource",
                type: "OpenLayers.Layer",
                group: 'background',
                args: [OpenLayers.i18n('blank'), {
                    displayInLayerSwitcher: false,
                    ref: 'blank',
                    group: 'background'
                }]
            }],
            items: []
        };
