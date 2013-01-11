# -*- coding: utf-8 -*-
## the leading / is needed to tell mako to look for the template using the provided TemplateLookup
<%inherit file="/A3_landscape.mako" />

## the backslash tell mako To Not write a new line at the end
<%def name="title()">\
4 A3 landscape demo\
</%def>

<%def name="backgroundPdf()">
      backgroundPdf: '<%text>$</%text>{configDir}/tpl_demo_A3_landscape.pdf'
</%def>
