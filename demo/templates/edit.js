Ext.onReady(function() {
    // Ext global settings
    Ext.BLANK_IMAGE_URL = "${request.static_url('demo:static/lib/cgxp/ext/Ext/resources/images/default/s.gif')}";
    Ext.QuickTips.init();

    // OpenLayers global settings
    OpenLayers.Number.thousandsSeparator = ' ';
    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
    OpenLayers.DOTS_PER_INCH = 72;
    OpenLayers.ImgPath = "${request.static_url('demo:static/lib/cgxp/core/src/theme/img/ol/')}";
    OpenLayers.Lang.setCode("${lang}");

    // GeoExt global settings
    GeoExt.Lang.set("${lang}");

% if user:
    var INITIAL_EXTENT = ${user.role.json_extent};
% else:
    var INITIAL_EXTENT = [-466375.77628413, 5379611.8001185, 1035458.955194, 6573252.433606];
% endif

    var THEMES = {
        "local": ${themes | n}
% if external_themes:
        , "external": ${external_themes | n}
% endif
    };

    var WMTS_OPTIONS = {
        url: ${tiles_url | n},
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
        projection: new OpenLayers.Projection("EPSG:3857"),
        units: "m",
        formatSuffix: 'png',
        serverResolutions: [156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,0.5971642833948135]
    };


    app = new gxp.Viewer({

        // viewer config
        portalConfig: {
            layout: 'border',
            ctCls: 'x-map',
            items: [
                'app-map',
            {
                id: 'left-panel',
                region: 'west',
                width: 300
            }]
        },

        // tools
        tools: [{
            ptype: 'cgxp_editing',
            layerTreeId: 'layertree',
            layersURL: "${request.route_url('layers_root')}"
        },
        {
            ptype: "cgxp_mapopacityslider",
            defaultBaseLayerRef: "${functionality['default_basemap'][0] | n}" //FUNCTIONALITY.default_basemap[0]
        },
        {
            ptype: 'cgxp_themeselector',
            outputTarget: 'left-panel',
            outputConfig: {
                layout: 'fit',
                style: 'padding: 3px;'
            },
            layerTreeId: 'layertree',
            themes: THEMES
        }, {
            ptype: "cgxp_layertree",
            id: "layertree",
            outputConfig: {
                header: false,
                flex: 1,
                layout: 'fit',
                autoScroll: true,
                themes: THEMES,
                wmsURL: '${request.route_url('mapserverproxy')}'
            },
            outputTarget: 'left-panel'
        }, {
            ptype: "cgxp_menushortcut",
            type: '->'
        }, {
            ptype: "cgxp_login",
            actionTarget: "map.tbar",
% if user:
            username: "${user.username}",
% endif
            loginURL: "${request.route_url('login', path='')}",
            logoutURL: "${request.route_url('logout', path='')}"
        }],

        // layer sources
        sources: {
            "olsource": {
                ptype: "gxp_olsource"
            }
        },

        // map and layers
        map: {
            id: "app-map", // id needed to reference map in portalConfig above
            stateId: "map",
            xtype: 'cgxp_mappanel',
            projection: new OpenLayers.Projection("EPSG:3857"),
            extent: INITIAL_EXTENT,
            maxExtent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
            //restrictedExtent: [420000, 30000, 900000, 350000],
            units: "m",
            //resolutions: [4000,2000,1000,500,250,100,50,20,10,5,2.5,1,0.5,0.25,0.1,0.05],
            resolutions: [156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,0.5971642833948135],
            controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.KeyboardDefaults(),
                new OpenLayers.Control.PanZoomBar({panIcons: false}),
                new OpenLayers.Control.ArgParser(),
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.ScaleLine({
                    bottomInUnits: false,
                    bottomOutUnits: false
                }),
                new OpenLayers.Control.MousePosition({numDigits: 0})
            ],
            layers: [{
                // base layers go here
                source: "olsource",
                type: "OpenLayers.Layer.WMTS",
                group: 'background',
                args: [Ext.applyIf({
                    name: OpenLayers.i18n('plan'),
                    mapserverLayers: 'plan',
                    ref: 'plan',
                    layer: 'plan',
                    group: 'background'
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
                       ref: 'osmmapquest'
                    }
                ]
            },
            {
                source: "olsource",
                type: "OpenLayers.Layer.WMTS",
                args: [Ext.applyIf({
                    name: OpenLayers.i18n('ortho'),
                    mapserverLayers: 'ortho',
                    ref: 'ortho',
                    layer: 'ortho',
                    formatSuffix: 'jpeg',
                    opacity: 0
                }, WMTS_OPTIONS)]
            }],
            items: []
        }
    });

    app.on('ready', function() {
        // remove loading message
        Ext.get('loading').remove();
        Ext.fly('loading-mask').fadeOut({
            remove: true
        });
    }, app);
});
