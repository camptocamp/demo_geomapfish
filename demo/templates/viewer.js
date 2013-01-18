Ext.onReady(function() {
    /*
     * Initialize the application.
     */
    // OpenLayers
    OpenLayers.Number.thousandsSeparator = ' ';
    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
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
        projection: new OpenLayers.Projection("EPSG:900913"),
        units: "m",
        formatSuffix: 'png',
        //serverResolutions: [4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5,0.25,0.1,0.05],
        serverResolutions: [156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,0.5971642833948135],
        getMatrix: function() {
            return { identifier: OpenLayers.Util.indexOf(this.serverResolutions, this.map.getResolution()) };
        }
    };

    app = new gxp.Viewer({
        portalConfig: {
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
            ptype: "cgxp_layertree",
            id: "layertree",
            outputConfig: {
                header: false,
                flex: 1,
                layout: "fit",
                autoScroll: true,
                themes: THEMES,
                % if permalink_themes:
                  defaultThemes: ${permalink_themes | n},
                % else:
                  defaultThemes: ["Equipement"],
                % endif
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
            srsName: 'EPSG:900913',
            featureTypes: ["MTP_adresse", "monuments", "arbres_remarq"],
        }, 
    % endif
        {
            ptype: "cgxp_print",
            legendPanelId: "legendPanel",
            featureProvider: "featureGrid",
            outputTarget: "left-panel",
            printURL: "${request.route_url('printproxy', path='')}",
            mapserverURL: "${request.route_url('mapserverproxy', path='')}", 
            options: {
                labelAlign: 'top',
                defaults: {
                    anchor:'100%'
                },
                autoFit: true
            }
        }, {
             ptype: "cgxp_featureswindow",
             themes: THEMES,
             events: EVENTS
        }, 
//        {
//            ptype: "cgxp_featuregrid",
//            id: "featureGrid",
//            csvURL: "${request.route_url('csvecho')}",
//            maxFeatures: 200,
//            outputTarget: "featuregrid-container",
//            events: EVENTS
//        }, 
        {
            ptype: "cgxp_mapopacityslider",
            defaultBaseLayerRef: "${functionality['default_basemap'][0] | n}" //FUNCTIONALITY.default_basemap[0]
        },
        {
            ptype: "gxp_zoomtoextent",
            actionTarget: "center.tbar",
            closest: true,
            extent: INITIAL_EXTENT
        },
        {
            ptype: "cgxp_zoom",
            actionTarget: "center.tbar",
            toggleGroup: "maptools"
        },
        {
            ptype: "gxp_navigationhistory",
            actionTarget: "center.tbar"
        }, 
        {
            ptype: "cgxp_permalink",
            actionTarget: "center.tbar"
        }, 
        {
            ptype: "cgxp_measure",
            actionTarget: "center.tbar",
            toggleGroup: "maptools"
        },
        {
            ptype: "cgxp_wfsgetfeature",
            WFSURL: "${request.route_url('mapserverproxy', path='')}",
            actionTarget: "center.tbar",
            events: EVENTS,
            themes: THEMES,
            WFSTypes: ${WFSTypes | n},
            externalWFSTypes: ${externalWFSTypes | n},
            enableWMTSLayers: true,
            toggleGroup: "maptools"
        }, 
        /*{
            ptype: "cgxp_wmsgetfeatureinfo",
            actionTarget: "center.tbar",
            toggleGroup: "maptools",
            events: EVENTS
        },*/ 
        {
            ptype: "cgxp_fulltextsearch",
            url: "${request.route_url('fulltextsearch', path='')}",
            layerTreeId: "layertree",
            pointRecenterZoom: 20,
            actionTarget: "center.tbar",
            grouping: true
        }, {
             ptype: 'cgxp_wmsbrowser',
             actionTarget: "center.tbar",
             layerTreeId: "layertree",
             defaultUrls: [
                'http://wms.geo.admin.ch',
                'http://ids.pigma.org/geoserver/wms',
                'http://geobretagne.fr/geoserver/wms'
             ]
        }, {
             ptype: 'cgxp_googleearthview',
             actionTarget: 'center.tbar',
             outputTarget: 'center',
             toggleGroup: 'maptools'
        }, {
             ptype: 'cgxp_streetview',
             actionTarget: 'center.tbar',
             outputTarget: 'center',
             toggleGroup: 'maptools',
             baseURL: "${request.static_url('demo:static/lib/cgxp/geoext.ux/ux/StreetViewPanel/')}"
        }, {
             ptype: 'cgxp_profile',
             actionTarget: 'center.tbar',
             toggleGroup: 'maptools',
             serviceUrl: "${request.route_url('profile.json')}",
             csvServiceUrl: "${request.route_url('profile.csv')}",
             rasterLayers: ['mnt', 'mns']
        }, {
            ptype: "cgxp_contextualdata",
            actionTarget: "center.tbar",
            toggleGroup: "maptools",
            tpls: {
               allTpl: OpenLayers.i18n("Local Coord. Label") + " : {coord_x} {coord_y}<br />" +
                       OpenLayers.i18n("Wsg Coord. Label") + " : {wsg_x} {wsg_y}<br /> etc."
            }
        },
        {
            ptype: "cgxp_menushortcut",
            actionTarget: "center.tbar",
            type: '->'
        },
        {
            ptype: "cgxp_redlining",
            toggleGroup: "maptools",
            actionTarget: "center.tbar",
            layerManagerUrl: "${request.static_url('demo:static/lib/cgxp/sandbox/LayerManager/ux/')}"
        },
        {
            ptype: "cgxp_legend",
            id: "legendPanel",
            toggleGroup: "maptools",
            actionTarget: "center.tbar"
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
    % endif
            loginURL: "${request.route_url('login', path='')}",
            logoutURL: "${request.route_url('logout', path='')}"
        },
        {
            ptype: "cgxp_menushortcut",
            actionTarget: "center.tbar",
            type: '-'
        }, 
        {
            ptype: "cgxp_help",
            url: "#help-url",
            actionTarget: "center.tbar"
        }, {
            ptype: "gxp_tool",
            actionTarget: "center.tbar",
            actions: [{
               xtype: 'button',
               icon: '${request.static_url('demo:static/img/icons/application_form.png')}',
               handler: function() {
                   window.location = '${request.route_url('home')}${lang}/admin';
               }
            }]
        }, {
            ptype: "gxp_tool",
            actionTarget: "center.tbar",
            actions: [{
                xtype: 'button',
                icon: '${request.static_url('demo:static/img/icons/application_edit.png')}',
                handler: function() {
                   window.location = '${request.route_url('home')}${lang}/edit';
               }

            }]
        }, {
            ptype: "cgxp_scalechooser",
            actionTarget: "center.bbar"
        }, {
            ptype: "cgxp_menushortcut",
            actionTarget: "center.bbar",
            type: '->'
        }, {
            ptype: "gxp_tool",
            actionTarget: "center.bbar",
            actions: '<a href="mailto:info+demo@camptocamp.com">Contact</a> - Développé par <a href="http://camptocamp.com">Camptocamp</a>.'
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
            projection: "EPSG:900913",
            extent: INITIAL_EXTENT,
            maxExtent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
            //restrictedExtent: RESTRICTED_EXTENT,
            stateId: "map",
            projection: new OpenLayers.Projection("EPSG:900913"),
            units: "m",
            //maxResolution: 156543.0339,
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
                                "(c) <a href='http://openstreetmap.org/'>OSM</a>",
                                "<a href='http://creativecommons.org/licenses/by-sa/2.0/'>by-sa</a>"
                            ].join(' ')
                        }
                    )]
                })
            ],
            layers: [{
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
            },
            {
                source: "olsource",
                type: "OpenLayers.Layer",
                group: 'background',
                args: [OpenLayers.i18n('blank'), {
                    displayInLayerSwitcher: false,
                    ref: 'blank',
                    group: 'background',
                    opacity: 0.8
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
