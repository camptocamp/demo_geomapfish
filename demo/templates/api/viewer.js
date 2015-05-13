<%doc>
This file defines the GXP viewer and its plugins for the Extended API.
</%doc>
        var viewer = new gxp.Viewer({
            portalConfig: {
                renderTo: config.div,
                height: Ext.get(config.div).getHeight(),
                layout: "fit",
                items: [config.id],
                ctCls: 'x-map'
            },
            tools: [
            {
                ptype: "cgxp_mapopacityslider",
                orthoRef: undefined
            },
            {
                ptype: "gxp_zoomtoextent",
                actionTarget: "map.tbar",
                closest: true,
                extent: [515000, 180000, 580000, 230000]
            },
            {
                ptype: "cgxp_zoom",
                actionTarget: "map.tbar",
                toggleGroup: "maptools"
            },
            {
                ptype: "cgxp_fulltextsearch",
                actionTarget: "map.tbar",
                url: "${request.route_url('fulltextsearch') | n}"
            },
            {
                ptype: "cgxp_menushortcut",
                actionTarget: "map.tbar",
                type: '->'
            },
            {
                ptype: "cgxp_legend",
                id: "legendPanel",
                toggleGroup: "maptools",
                actionTarget: "map.tbar"
            }],
            sources: {
                "olsource": {
                    ptype: "gxp_olsource"
                }
            },
            map: config
        });
