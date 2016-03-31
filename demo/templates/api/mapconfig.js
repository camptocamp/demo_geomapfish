<%doc>
This file defines map config for both the Simple and the
Extended APIs.
</%doc>

        var WMTS_OPTIONS = {
            url: ${dumps(request.registry.settings['tiles_url']) | n},
            layer: 'map',
            displayInLayerSwitcher: false,
            requestEncoding: 'REST',
            buffer: 0,
            transitionEffect: "resize",
            visibility: false,
            style: 'default',
            matrixSet: 'swissgrid_005',
            maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
            projection: new OpenLayers.Projection("EPSG:21781"),
            units: "m",
            formatSuffix: 'png',
            serverResolutions: [1000, 500, 250, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05]
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

        var INITIAL_EXTENT = [529000, 147000, 555000, 161000];
        var MAX_EXTENT = [420000, 30000, 900000, 350000];
        var RESTRICTED_EXTENT = [420000, 40500, 839000, 306400];

        var mapConfig = {
            xtype: 'cgxp_mappanel',
            extent: INITIAL_EXTENT,
            maxExtent: MAX_EXTENT,
            restrictedExtent: RESTRICTED_EXTENT,
            projectionCodes: [21781, 2056, 4326],
            stateId: "map",
            projection: new OpenLayers.Projection("EPSG:21781"),
            units: "m",
            resolutions: [200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05],
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
                new OpenLayers.Control.OverviewMap({
                    size: new OpenLayers.Size(200, 100),
                    layers: [new OpenLayers.Layer.WMTS(WMTS_OPTIONS)],
                    mapOptions: {
                        theme: null,
                        numZoomLevels: 1
                    }
                }),
                new OpenLayers.Control.MousePosition({numDigits: 0})
            ],
            layers: [
            {
                source: "olsource",
                type: "OpenLayers.Layer.WMTS",
                group: 'background',
                args: [OpenLayers.Util.applyDefaults({
                    name: OpenLayers.i18n('asitvd.fond_couleur'),
                    ref: 'asitvd.fond_couleur',
                    layer: 'asitvd.fond_couleur',
                    queryLayers: [],
                    transitionEffect: "resize",
                    group: 'background',
                    visibility: false
                }, WMTSASITVD_OPTIONS2)]
            },
            {
                source: "olsource",
                type: "OpenLayers.Layer.WMTS",
                group: 'background',
                args: [OpenLayers.Util.applyDefaults({
                    name: OpenLayers.i18n('asitvd.fond_gris'),
                    ref: 'asitvd.fond_gris',
                    layer: 'asitvd.fond_gris',
                    queryLayers: [],
                    transitionEffect: "resize",
                    group: 'background',
                    visibility: false
                }, WMTSASITVD_OPTIONS2)]
            },
            {
                source: "olsource",
                type: "OpenLayers.Layer.WMTS",
                args: [OpenLayers.Util.applyDefaults({
                    name: OpenLayers.i18n('asitvd.fond_pourortho'),
                    ref: 'ortho',
                    layer: 'asitvd.fond_pourortho',
                    queryLayers: [],
                    transitionEffect: "resize",
                    visibility: false
                }, WMTSASITVD_OPTIONS2)]
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
