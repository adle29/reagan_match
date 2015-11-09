require.config({
  paths: {
    jQuery: '/js/libs/jquery',
    doc: '/js/libs/doc',
    Underscore: '/js/libs/underscore',
    Backbone: '/js/libs/backbone',
    match: '/js/libs/match',
    bootstrap: '/js/libs/bootstrap',
    d3: '/js/libs/d3',
    stellar: "/js/libs/stellar",
    text: '/js/libs/text',
    templates: '../templates',
    AdaptiveMindView: '/js/AdaptiveMindView'
  },

  shim: {
    'bootstrap': ['jQuery'],
    
    'Backbone': ['Underscore', 'jQuery', 'bootstrap', 'match'],
    'AdaptiveMind': ['Backbone', 'doc', 'd3']
  }
});

require(['AdaptiveMind'], function(AdaptiveMind) {
  AdaptiveMind.initialize();
});
