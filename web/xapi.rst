<style type="text/css">
.ombrage {
  box-shadow: -1px 2px 5px 1px rgba(0, 0, 0, 0.7);
}
.olMapViewport .olControlLayerSwitcher .layersDiv {
    background-color: #000000 !important;
}
.content .legend, .legend {
    text-align: left !important;
}
      </style>

<script src="../../xapi.js"></script>
<script>
window.onload = function() {
   var map = new demo.Map({
     div: 'map1', // id of the div element to put the map in
     zoom: 15,
     center: [431636.8,5405443.7],
     //layers: ['zonepietonne,sitesclasses,fontaines,monuments'],
     layers: ['camera','airedejeux'],
     addLayerSwitcher: true
   });
};

</script>

.. _`c2cgp.xapi`:

=============
API avancée
=============

Vous pouvez utiliser une API avancé pour créer des applications web au sein de vos pages HTML.

Couches des équipements montpelliérains
========================================

<div id='map1' style='width:920px;height:750px;'></div>

