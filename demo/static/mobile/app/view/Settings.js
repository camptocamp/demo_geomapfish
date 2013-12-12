Ext.define("App.view.Settings", {
    extend: 'Ext.Container',
    xtype: 'settingsview',

    config: {
        scrollable: 'vertical',
        items: [{
            docked: 'top',
            xtype: 'toolbar',
            items: [{
                xtype: 'spacer'
            }, {
                xtype: 'button',
                iconCls: 'home',
                iconMask: true,
                action: 'home'
            }]
        }, {
            xtype: 'container',
            cls: 'settings',
            items: [{
                xtype: 'map_permalink'
            }, {
                xtype: 'component',
                html: 
                    '<h1 class="title">Copyright</h1>' +
                    'Base Layer: Data CC-By-SA by <a href="http://openstreetmap.org/">OpenStreetMap</a><br />' +
                    'Overlay Layers: Open Data licence <a href="http://opendata.montpelliernumerique.fr">Montpellier</a>'
            }]
        }]
    }
});
