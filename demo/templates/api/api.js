% if debug:
    <%!
    from jstools.merge import Merger
    %>
    <%
    jsbuild_settings = request.registry.settings.get('jsbuild', {})
    jsbuild_cfg = jsbuild_settings.get('config')
    jsbuild_root_dir = jsbuild_settings.get('root_dir')
    %>
    % for script in Merger.from_fn(jsbuild_cfg, root_dir=jsbuild_root_dir).list_run(['api.js', 'api-lang-%s.js' % lang]):
document.write('<script type="text/javascript" src="${request.static_url(script.replace('/', ':', 1))}"></script>');
    % endfor

document.write('<link rel="stylesheet" type="text/css" href="'
        + "${request.static_url('demo:static/lib/cgxp/openlayers/theme/default/style.css')}" + '" />');
document.write('<link rel="stylesheet" type="text/css" href="'
        + "${request.static_url('demo:static/css/proj-map.css')}" + '" />');
% else:
document.write('<scr' + 'ipt type="text/javascript" src="'
        + "${request.static_url('demo:static/build/api.js', _query=url_params)}" + '"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="'
        + "${request.static_url('demo:static/build/api-lang-%s.js' % lang, _query=url_params)}" + '"></scr' + 'ipt>');
document.write('<link rel="stylesheet" type="text/css" href="'
        + "${request.static_url('demo:static/build/api.css', _query=url_params)}" + '" />');
% endif


demo = {};
demo.Map = function(config) {
    if (!this.initMap) {

        /*
         * Initialize the API.
         * - Set globals
         * - Create child class
         */

        OpenLayers.Number.thousandsSeparator = ' ';
        OpenLayers.DOTS_PER_INCH = 72;
        OpenLayers.ImgPath = "${request.static_url('demo:static/lib/cgxp/core/src/theme/img/ol/')}";
        OpenLayers.Lang.setCode("${lang}");

        OpenLayers.inherit(demo.Map, cgxp.api.Map);

        demo.Map.prototype.initMap = function() {
            <%include file="mapconfig.js"/>
            this.initMapFromConfig(mapConfig);
        };

        return new demo.Map(config);
    }

    this.wmsURL = "${request.route_url('mapserverproxy')}";
    this.queryableLayers = ${queryable_layers|n};
    return cgxp.api.Map.call(this, config);
};
