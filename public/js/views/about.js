define(['AdaptiveMindView', 'text!templates/about.html'],
function(AdaptiveMindView, indexTemplate) {
    var indexView = AdaptiveMindView.extend ({
    	el: $('#content'),

    	initialize: function (){
    		$.ajax("/logOut", {
		      method: "GET"
		    });
    	},

    	render: function() {
      		this.$el.html(indexTemplate);
    	}

    }); 
    
    return indexView;
});


