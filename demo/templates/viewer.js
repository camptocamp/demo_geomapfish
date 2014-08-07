Ext.onReady(function() {
    /*
     * Initialize the application.
     */
    // OpenLayers
    OpenLayers.Number.thousandsSeparator = ' ';
    OpenLayers.DOTS_PER_INCH = 72;
    OpenLayers.ProxyHost = "${request.route_url('ogcproxy')}?url=";

    // Ext
    Ext.QuickTips.init();

    OpenLayers.ImgPath = "${request.static_url('demo:static/lib/cgxp/core/src/theme/img/ol/')}";
    Ext.BLANK_IMAGE_URL = "${request.static_url('demo:static/lib/cgxp/ext/Ext/resources/images/default/s.gif')}";

    // Apply same language than on the server side
    OpenLayers.Lang.setCode("${lang}");
    GeoExt.Lang.set("${lang}");

    // Server errors (if any)
    var serverError = ${serverError | n};

    // Themes definitions
    var THEMES = {
        "local": ${themes | n}
% if external_themes:
        , "external": ${external_themes | n}
% endif
    };

% if user and user.role.extent:
    var INITIAL_EXTENT = ${user.role.json_extent};
% else:
    var INITIAL_EXTENT = [-466375.77628413, 5379611.8001185, 1035458.955194, 6573252.433606];
% endif

    var RESTRICTED_EXTENT = [-666375.77628413, 3379611.8001185, 1235458.955194, 7573252.433606];

    // Used to transmit event throw the application
    var EVENTS = new Ext.util.Observable();

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
        //maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
        projection: new OpenLayers.Projection("EPSG:3857"),
        units: "m",
        formatSuffix: 'png',
        //serverResolutions: [1000,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5,0.25,0.1,0.05],
        serverResolutions: [156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,0.5971642833948135]
    };

    app = new gxp.Viewer({
        portalConfig: {
            ctCls: 'x-map',
            layout: "border",
            // by configuring items here, we don't need to configure portalItems
            // and save a wrapping container
            items: [{
                region: "north",
                contentEl: 'header-out'
            },
            {
                region: 'center',
                layout: 'border',
                id: 'center',
                tbar: [],
                bbar: [],
                items: [
                    "app-map"
                ]
            },
            {
                id: "featuregrid-container",
                xtype: "panel",
                layout: "fit",
                region: "south",
                height: 160,
                split: true,
                collapseMode: "mini",
                hidden: true,
                bodyStyle: 'background-color: transparent;'
            },
            {
                layout: "accordion",
                id: "left-panel",
                region: "west",
                width: 300,
                minWidth: 300,
                split: true,
                collapseMode: "mini",
                border: false,
                defaults: {width: 300},
                items: [{
                    xtype: "panel",
                    title: OpenLayers.i18n("layertree"),
                    id: 'layerpanel',
                    layout: "vbox",
                    bbar: [],
                    layoutConfig: {
                        align: "stretch"
                    }
                }]
            }]
        },

        // configuration of all tool plugins for this application
        tools: [
        {
            ptype: "cgxp_disclaimer",
            outputTarget: "map"
        },
        {
            ptype: "cgxp_themeselector",
            outputTarget: "layerpanel",
            layerTreeId: "layertree",
            themes: THEMES,
            outputConfig: {
                layout: "fit",
                style: "padding: 3px 0 3px 3px;"
            }
        },
        {
            ptype: "cgxp_themefinder",
            outputTarget: "layerpanel",
            layerTreeId: "layertree",
            themes: THEMES,
            outputConfig: {
                layout: "fit",
                style: "padding: 3px;"
            }
        },
        {
            ptype: "cgxp_layertree",
            id: "layertree",
            outputConfig: {
                header: false,
                flex: 1,
                layout: "fit",
                autoScroll: true,
                themes: THEMES,
% if permalink_themes:
                permalinkThemes: ${permalink_themes | n},
% endif
                defaultThemes: ["Equipement"],
                uniqueTheme: true,
                wmsURL: "${request.route_url('mapserverproxy', path='')}"
            },
            outputTarget: "layerpanel"
        },
% if user:
        {
            ptype: "cgxp_querier",
            outputTarget: "left-panel",
            events: EVENTS,
            mapserverproxyURL: "${request.route_url('mapserverproxy', path='')}",
            // don't work with actual version of mapserver, the proxy will limit to 200
            // it is intended to be reactivated this once mapserver is fixed
            //maxFeatures: 200,
            srsName: 'EPSG:3857',
            featureTypes: ["MTP_adresse", "monuments", "arbres_remarq"],
            attributeURLs: ${queryer_attribute_urls | n}
        },
% endif
% if 'grid' in request.params:
        {
            ptype: "cgxp_featuresgrid",
            id: "featuresGrid",
            csvURL: "${request.route_url('csvecho')}",
            maxFeatures: 200,
            outputTarget: "featuregrid-container",
            events: EVENTS,
            csvIncludeHeader: true
        },
% else:
        {
            ptype: "cgxp_featureswindow",
            themes: THEMES,
            events: EVENTS,
            id: "featuresWindow"
        },
% endif
        {
            ptype: "cgxp_mapopacityslider",
            layerTreeId: "layertree",
            defaultBaseLayerRef: "${functionality['default_basemap'][0] | n}"
        },
        {
            ptype: "gxp_zoomtoextent",
            actionTarget: "center.tbar",
            closest: true,
            extent: INITIAL_EXTENT
        },
        {
            ptype: "cgxp_getfeature",
            mapserverURL: "${request.route_url('mapserverproxy', path='')}",
            actionTarget: null, //"center.tbar",
            events: EVENTS,
            themes: THEMES,
            actionTooltip: OpenLayers.i18n('Query the map'),
            WFSTypes: ${WFSTypes | n},
            externalWFSTypes: ${externalWFSTypes | n},
            enableWMTSLayers: true,
            toggleGroup: "maptools"
        },
        {
            ptype: "cgxp_contextualdata",
            actionTarget: "center.tbar",
            toggleGroup: "maptools",
            streetViewLink: true,
            mouseoverWindowConfig: {
                width: 270
            },
            rightclickWindowConfig: {
                width: 270
            },
            tpls: {
                allTpl:
                    OpenLayers.i18n("Local Coord. Label") + " : {coord_x} {coord_y}<br />" +
                    OpenLayers.i18n("Wgs Coord. Label") + " : {wgs_x} {wgs_y}<br />" +
                    "<a href='http://maps.google.ch/?ie=UTF8&ll={streetviewlat},{streetviewlon}&layer=c" +
                    "&cbll={streetviewlat},{streetviewlon}&cbp=12,57.78,,0,8.1' " +
                    "target='_blank'>{streetviewlabel}</a>"
            }
        },
        {
            ptype: "cgxp_fulltextsearch",
            url: "${request.route_url('fulltextsearch', path='')}",
            layerTreeId: "layertree",
            pointRecenterZoom: 20,
            actionTarget: "center.tbar",
            grouping: true
        },


        {
            ptype: "cgxp_menushortcut",
            actionTarget: "center.tbar",
            type: '->'
        },
        {
            ptype: "cgxp_menushortcut",
            actionTarget: "center.tbar",
            type: '-'
        },
        {
            ptype: "cgxp_print",
            toggleGroup: "maptools",
            legendPanelId: "legendPanel",
% if 'grid' in request.params:
            featureProvider: "featuresGrid",
% else:
            featureProvider: "featuresWindow",
% endif
            actionTarget: "center.tbar",
            printURL: "${request.route_url('printproxy', path='')}",
            mapserverURL: "${request.route_url('mapserverproxy', path='')}",
            options: {
                labelAlign: 'top',
                defaults: {
                    anchor:'100%'
                },
                autoFit: true
            }
        },
        {
            ptype: "cgxp_permalink",
            id: "permalink",
            actionTarget: "center.tbar",
            shortenerCreateURL: "${request.route_url('shortener_create', path='')}",
            actionConfig: {
                text: OpenLayers.i18n("Link")
            }
        },
        {
            ptype: "cgxp_menushortcut",
            actionTarget: "center.tbar",
            type: '-'
        },
        {
            ptype: "cgxp_measure",
            actionTarget: "center.tbar",
            toggleGroup: "maptools",
            actionConfig: {
                text: OpenLayers.i18n("Measure")
            }
        },
        {
            ptype: 'cgxp_profile',
            actionTarget: 'center.tbar',
            toggleGroup: 'maptools',
            serviceUrl: "${request.route_url('profile.json')}",
            csvServiceUrl: "${request.route_url('profile.csv')}",
            rasterLayers: ['mnt'],
            actionConfig: {
                text: OpenLayers.i18n("Profile")
            }
        },
        {
            ptype: "cgxp_menushortcut",
            actionTarget: "center.tbar",
            type: '-'
        },
        {
            ptype: "cgxp_redlining",
            toggleGroup: "maptools",
            actionTarget: "center.tbar",
            redliningText: OpenLayers.i18n('Dessin'),
            layerManagerUrl: "${request.static_url('demo:static/lib/cgxp/sandbox/LayerManager/ux/')}",
            actionConfig: {
                iconCls: 'cgxp-icon-redline',
                tooltip: OpenLayers.i18n("Draw geometries on the map")
            }
        },
        {
             ptype: 'cgxp_googleearthview',
             actionTarget: 'center.tbar',
             outputTarget: 'center',
             toggleGroup: 'maptools',
             actionConfig: {
                text: OpenLayers.i18n("Google Earth"),
                tooltip: OpenLayers.i18n('Open Google Earth Panel')
             }
        },
        {
            ptype: "cgxp_legend",
            id: "legendPanel",
            toggleGroup: "maptools",
            actionTarget: "center.tbar",
            actionConfig: {
                iconCls: 'cgxp-icon-legend'
            }
        },
        {
            ptype: "cgxp_menushortcut",
            actionTarget: "center.tbar",
            type: '-'
        },
        {
            ptype: "cgxp_login",
            actionTarget: "center.tbar",
            toggleGroup: "maptools",
% if user:
            username: "${user.username}",
            isPasswordChanged: ${"true" if user.is_password_changed else "false"},
% endif
            loginURL: "${request.route_url('login', path='')}",
            loginChangeURL: "${request.route_url('loginchange', path='')}",
            logoutURL: "${request.route_url('logout', path='')}",
            enablePasswordChange: true,
            forcePasswordChange: true,
            permalinkId: "permalink"
        },


        {
             ptype: 'cgxp_wmsbrowser',
             actionTarget: "layerpanel.bbar",
             layerTreeId: "layertree",
             actionConfig: {
                tooltip: OpenLayers.i18n('Add a WMS layer on the map')
             },
             defaultUrls: [
                'http://wms.geo.admin.ch',
                'http://ids.pigma.org/geoserver/wms',
                'http://geobretagne.fr/geoserver/wms'
             ]
        },
        {
            ptype: "cgxp_addkmlfile",
            echoUrl: "${request.route_url('echo', path='')}",
            actionTarget: "layerpanel.bbar"
        },

        {
            ptype: "cgxp_scalechooser",
            actionTarget: "center.bbar",
            roundValues: [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10],
            power10: true
        },
        {
            ptype: "cgxp_menushortcut",
            actionTarget: "center.bbar",
            type: '->'
        },
        {
            ptype: "gxp_tool",
            actionTarget: "center.bbar",
            actions: '<a href="mailto:info+demo@camptocamp.com">Contact</a> - Développé par <a href="http://www.camptocamp.com" target="_blank" title="Camptocamp: inovative solutions by open source expert!">Camptocamp</a> - <a target="_blank" href="http://geomapfish.org/">GeoMapFish</a>.'
        }
        ],

        // layer sources
        sources: {
            "olsource": {
                ptype: "gxp_olsource"
            }
        },

        // map and layers
        map: {
            id: "app-map", // id needed to reference map in portalConfig above
            xtype: 'cgxp_mappanel',
            projection: "EPSG:3857",
            extent: INITIAL_EXTENT,
            maxExtent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
            //restrictedExtent: RESTRICTED_EXTENT,
            stateId: "map",
            projection: new OpenLayers.Projection("EPSG:3857"),
            units: "m",
            //resolutions: [1000,500,250,100,50,20,10,5,2.5,1,0.5,0.25,0.1,0.05],
            resolutions: [156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,0.5971642833948135],
            controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.KeyboardDefaults(),
                new OpenLayers.Control.PanZoomBar({
                    panIcons: false,
                    zoomWorldIcon: true
                }),
                new OpenLayers.Control.ArgParser(),
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.ScaleLine({
                    bottomInUnits: false,
                    bottomOutUnits: false
                }),
                new OpenLayers.Control.MousePosition({numDigits: 0}),
                // OSM version
                new OpenLayers.Control.OverviewMap({
                    size: new OpenLayers.Size(200, 100),
                    mapOptions: {
                        theme: null
                    },
                    minRatio: 64,
                    maxRatio: 64,
                    layers: [new OpenLayers.Layer.OSM("OSM", [
                           'http://otile1.mqcdn.com/tiles/1.0.0/osm/${"${z}/${x}/${y}"}.png',
                           'http://otile2.mqcdn.com/tiles/1.0.0/osm/${"${z}/${x}/${y}"}.png',
                           'http://otile3.mqcdn.com/tiles/1.0.0/osm/${"${z}/${x}/${y}"}.png'
                        ], {
                            transitionEffect: 'resize',
                            attribution: [
                                'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>',
                                ' <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'
                            ].join(' '),
                        }
                    )]
                })
            ],
            layers: [
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
                            'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>',
                            ' <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'
                        ].join(' '),
                        group: 'background',
                        projection: "EPSG:3857", 
                        ref: 'mapquest',
                        visibility: false
                    }
                ]
            },
            {
                source: "olsource",
                type: "OpenLayers.Layer.OSM",
                group: 'background',
                args: [
                    "Cycle Map",
                    [
                        "http://a.tile.opencyclemap.org/cycle/${'${z}/${x}/${y}'}.png",
                        "http://b.tile.opencyclemap.org/cycle/${'${z}/${x}/${y}'}.png",
                        "http://c.tile.opencyclemap.org/cycle/${'${z}/${x}/${y}'}.png"
                    ],
                    {
                        transitionEffect: 'resize',
                        attribution: [
                            '© <a href="/copyright">Contributeurs de OpenStreetMap</a>. ',
                            'Tiles courtesy of <a target="_blank" href="http://www.thunderforest.com/">Andy Allan</a>'
                        ].join(' '),
                        group: 'background',
                        projection: "EPSG:3857", 
                        ref: 'opencyclemap',
                        visibility: false
                    }
                ]
            },
            {
                source: "olsource",
                type: "OpenLayers.Layer.OSM",
                group: 'background',
                args: [
                    "Transport Map",
                    [
                        "http://a.tile2.opencyclemap.org/transport/${'${z}/${x}/${y}'}.png",
                        "http://b.tile2.opencyclemap.org/transport/${'${z}/${x}/${y}'}.png",
                        "http://c.tile2.opencyclemap.org/transport/${'${z}/${x}/${y'}}.png"
                    ],
                    {
                        transitionEffect: 'resize',
                        attribution: [
                            '© <a href="/copyright">Contributeurs de OpenStreetMap</a>. ',
                            'Tiles courtesy of <a target="_blank" href="http://www.thunderforest.com/">Andy Allan</a>'
                        ].join(' '),
                        group: 'background',
                        projection: "EPSG:3857", 
                        ref: 'transport',
                        visibility: false
                    }
                ]
            },
            {
                source: "olsource",
                type: "OpenLayers.Layer.OSM",
                args: [
                    OpenLayers.i18n('ortho'),
                    [
                        "http://a.tiles.mapbox.com/v2/camptocamp.map-con6pdvs/${'${z}/${x}/${y}'}.png",
                        "http://b.tiles.mapbox.com/v2/camptocamp.map-con6pdvs/${'${z}/${x}/${y}'}.png"
                    ],
                    {
                        transitionEffect: 'resize',
                        attribution: [
                            "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> ",
                            "<a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"
                        ].join(' '),
                        ref: 'ortho',
                        visibility: false,
                        projection: "EPSG:3857", 
                        opacity: 0
                    }
                ]
            },
            {
                source: "olsource",
                type: "OpenLayers.Layer",
                group: 'background',
                args: [OpenLayers.i18n('blank'), {
                    displayInLayerSwitcher: false,
                    ref: 'blank',
                    group: 'background',
                    opacity: 0
                }]
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

        if (serverError.length > 0) {
            cgxp.tools.openWindow({
                html: serverError.join('<br />')
            },OpenLayers.i18n("Error notice"),600, 500);
        }
    }, app);
});
