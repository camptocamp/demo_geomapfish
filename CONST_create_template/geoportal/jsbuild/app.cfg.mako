#
# This is the config file for jsbuild utility
# Documentation on the syntax of this file is available at:
# http://pypi.python.org/pypi/JSTools#configuration-format
#

#
# Notes:
#
# Language files are in the lang-*.js builds. Except for one file:
# OpenLayers/Lang.js. This is tricky. This one is included in the main build,
# e.g. app.js. The thing is that OpenLayers/Lang.js requires
# OpenLayers/SingleFile.js, which resets the OpenLayers (root) object.  And we
# can obviously not reset the OpenLayers object when evaluating lang-*.js.
#
# Warning: when adding a comment whose leading "#" is not on the first
# column in the file do not add a space between the "#" character and
# the actual comment. For example, use "#GXP", not "# GXP". Really,
# this should be fixed in jsbuild.
#

<%
root = [
    "geoportal/demo_geoportal/static/lib/cgxp/core/src/script",
    "geoportal/demo_geoportal/static/lib/cgxp/ext",
    "geoportal/demo_geoportal/static/lib/cgxp/geoext/lib",
    "geoportal/demo_geoportal/static/lib/cgxp/openlayers/lib",
    "geoportal/demo_geoportal/static/lib/cgxp/openlayers.addins/GoogleEarthView/lib",
    "geoportal/demo_geoportal/static/lib/cgxp/openlayers.addins/Spherical/lib",
    "geoportal/demo_geoportal/static/lib/cgxp/openlayers.addins/URLCompressed/lib",
    "geoportal/demo_geoportal/static/lib/cgxp/openlayers.addins/DynamicMeasure/lib",
    "geoportal/demo_geoportal/static/lib/cgxp/openlayers.addins/AddViaPoint/lib",
    "geoportal/demo_geoportal/static/lib/cgxp/openlayers.addins/AutoProjection/lib",
    "geoportal/demo_geoportal/static/lib/cgxp/gxp/src/script",
    "geoportal/demo_geoportal/static/lib/cgxp/proj4js",
    "geoportal/demo_geoportal/static/lib/cgxp/geoext.ux/ux/Measure/lib",
    "geoportal/demo_geoportal/static/lib/cgxp/geoext.ux/ux/SimplePrint/lib",
    "geoportal/demo_geoportal/static/lib/cgxp/geoext.ux/ux/FeatureEditing/lib",
    "geoportal/demo_geoportal/static/lib/cgxp/geoext.ux/ux/FeatureSelectionModel/lib",
    "geoportal/demo_geoportal/static/lib/cgxp/geoext.ux/ux/WMSBrowser/lib",
    "geoportal/demo_geoportal/static/lib/cgxp/geoext.ux/ux/StreetViewPanel",
    "geoportal/demo_geoportal/static/lib/cgxp/sandbox",
    "geoportal/demo_geoportal/static/lib/cgxp/styler/lib",
    "geoportal/demo_geoportal/static/lib/cgxp/ext.ux/TwinTriggerComboBox",
    "geoportal/demo_geoportal/static/lib/cgxp/ext.ux/GroupComboBox",
    "geoportal/demo_geoportal/static/lib/cgxp/ext.ux/ColorPicker",
    "geoportal/demo_geoportal/static/lib/cgxp/ext.ux/base64",
    "geoportal/demo_geoportal/static/lib/cgxp/ext.overrides",
    "geoportal/demo_geoportal/static/lib/cgxp/dygraphs",
    "geoportal/demo_geoportal/static/js",
]
%>

[lang-en.js]
root =
    ${"\n    ".join(root)}
first =
    OpenLayers/Lang/en.js
last =
    Proj/Lang/en.js
include =
    Ext/src/locale/ext-lang-en.js
    Styler/lang/en.js
    locale/en.js #GXP
exclude =
    OpenLayers/Lang.js

[lang-fr.js]
root =
    ${"\n    ".join(root)}
first =
    OpenLayers/Lang/fr.js
last =
    Proj/Lang/fr.js
    Proj/Lang/GeoExt-fr.js
include =
    Ext/src/locale/ext-lang-fr.js
    GeoExt/locale/GeoExt-fr.js
    FeatureEditing/resources/lang/fr.js
    Styler/lang/fr.js
    GeoExt.ux/locale/WMSBrowser-fr.js
    ux/locale/StreetViewPanel-fr.js
    locale/fr.js #GXP
    CGXP/locale/fr.js
    locale/SimplePrint-fr.js
exclude =
    OpenLayers/Lang.js

[lang-de.js]
root =
    ${"\n    ".join(root)}
first =
    OpenLayers/Lang/de.js
last =
    Proj/Lang/de.js
    Proj/Lang/GeoExt-de.js
include =
    Ext/src/locale/ext-lang-de.js
#    GeoExt/locale/GeoExt-de.js
    FeatureEditing/resources/lang/de.js
    Styler/lang/de.js
    GeoExt.ux/locale/WMSBrowser-de.js
    ux/locale/StreetViewPanel-de.js
    locale/de.js #GXP
    CGXP/locale/de.js
    locale/SimplePrint-de.js
exclude =
    OpenLayers/Lang.js

[api.js]
root =
    ${"\n    ".join(root)}
first =
    OpenLayers/SingleFile.js
    OpenLayers/Console.js
    OpenLayers/BaseTypes.js
    OpenLayers/BaseTypes/Class.js
    OpenLayers/BaseTypes/Pixel.js
    OpenLayers/BaseTypes/Bounds.js
    OpenLayers/BaseTypes/LonLat.js
    OpenLayers/BaseTypes/Element.js
    OpenLayers/BaseTypes/Size.js
    OpenLayers/Util.js
    OpenLayers/Lang.js
    proj4js/lib/proj4js.js
    proj4js/lib/projCode/merc.js
include =
    EPSG21781.js #proj4js
    OpenLayers/Control/Navigation.js
    OpenLayers/Control/PanZoomBar.js
    OpenLayers/Control/ArgParser.js
    OpenLayers/Control/Attribution.js
    OpenLayers/Control/ScaleLine.js
    OpenLayers/Control/MousePosition.js
    OpenLayers/Control/OverviewMap.js
    OpenLayers/Control/LayerSwitcher.js
    OpenLayers/Layer/WMTS.js
    OpenLayers/Layer/TMS.js
    OpenLayers/Layer/OSM.js
    CGXP/api/Map.js

[api-lang-en.js]
root =
    ${"\n    ".join(root)}
first =
    OpenLayers/Lang/en.js
include =
    Proj/Lang/en.js
exclude =
    OpenLayers/Lang.js

[api-lang-fr.js]
root =
    ${"\n    ".join(root)}
first =
    OpenLayers/Lang/fr.js
include =
    Proj/Lang/fr.js
exclude =
    OpenLayers/Lang.js

[api-lang-de.js]
root =
    ${"\n    ".join(root)}
first =
    OpenLayers/Lang/de.js
include =
    Proj/Lang/de.js
exclude =
    OpenLayers/Lang.js

[xapi.js]
root =
    ${"\n    ".join(root)}
first =
    Ext/adapter/ext/ext-base-debug.js
    Ext/ext-all-debug.js
    GeoExt/Lang.js
    OpenLayers/SingleFile.js
    OpenLayers/Console.js
    OpenLayers/BaseTypes.js
    OpenLayers/BaseTypes/Class.js
    OpenLayers/BaseTypes/Pixel.js
    OpenLayers/BaseTypes/Bounds.js
    OpenLayers/BaseTypes/LonLat.js
    OpenLayers/BaseTypes/Element.js
    OpenLayers/BaseTypes/Size.js
    OpenLayers/Util.js
    OpenLayers/Lang.js
    proj4js/lib/proj4js.js
    proj4js/lib/projCode/merc.js
include =
    EPSG21781.js #proj4js
    util.js #GXP
    widgets/Viewer.js #GXP
    CGXP/cgxp.js
    CGXP/api/Map.js
    CGXP/plugins/Zoom.js
    CGXP/plugins/Redlining.js
    CGXP/plugins/MapOpacitySlider.js
    CGXP/plugins/MenuShortcut.js
    CGXP/plugins/Legend.js
    CGXP/plugins/Help.js
    CGXP/plugins/Measure.js
    CGXP/plugins/FullTextSearch.js
    CGXP/plugins/Disclaimer.js
    CGXP/widgets/MapPanel.js
    OpenLayers/Control/Navigation.js
    OpenLayers/Control/PanZoomBar.js
    OpenLayers/Control/ArgParser.js
    OpenLayers/Control/Attribution.js
    OpenLayers/Control/ScaleLine.js
    OpenLayers/Control/MousePosition.js
    OpenLayers/Control/NavigationHistory.js
    OpenLayers/Control/OverviewMap.js
    OpenLayers/Control/LayerSwitcher.js
    OpenLayers/Layer/WMTS.js
    OpenLayers/Layer/TMS.js
    OpenLayers/Layer/OSM.js
    plugins/OLSource.js #GXP
    plugins/ZoomToExtent.js #GXP
    plugins/NavigationHistory.js #GXP
exclude =
    GeoExt.js
    GeoExt/SingleFile.js
