
.. raw:: html

   <style type="text/css">
      .ombrage {
        box-shadow: -1px 2px 5px 1px rgba(0, 0, 0, 0.7);
      }
      .content a:hover {
        text-decoration:underline;
      }
      .olMapViewport .olControlLayerSwitcher .layersDiv {
          background-color: #000000 !important;
          border-radius: 10px;
      }
   </style>

   <script src="../../../api.js"></script>
   <script>
      window.onload = function() {
         var map = new demo.Map({
           div: 'map1', // id of the div element to put the map in
           zoom: 15,
           center: [431636.8,5405443.7],
           //layers: ['zonepietonne,sitesclasses,fontaines,monuments'],
           layers: ['airedejeux'],
           addLayerSwitcher: true,
           layerSwitcherExpanded: true
         });
      };
      
      
   </script>

.. _`c2cgp.api`:

==============================
Démonstration de l'API simple
==============================

Vous pouvez intégrer des cartes simples issues de votre portail cartographique 
dans n'importe quelle page HTML. Deux APIs sont disponibles l'une simple, 
présentée dans cette page, l'autre avancé qui permet plus de possibilités.

Cartes des aires de jeux à Montpellier
=======================================

.. raw:: html
   
   <div id='map1' style='width:900px;height:400px;'></div>

