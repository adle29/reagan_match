
define(['AdaptiveMindView', 'text!templates/thanks.html'],
function(AdaptiveMindView, indexTemplate) {
    var indexView = AdaptiveMindView.extend ({
    	el: $('#content'),

    	render: function() {
      		this.$el.html(indexTemplate);
    	}

    }); 
    
    return indexView;
});


