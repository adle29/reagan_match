
define(['AdaptiveMindView', 'text!templates/index.html'],
function(AdaptiveMindView, indexTemplate) {
    var indexView = AdaptiveMindView.extend ({
    	el: $('#content'),

    	initialize: function (){
    		$.ajax("/logOut", {
		      method: "GET"
		    });
    	},
	
	counter: function(){
		    $.ajax("/cnts", {
              method: "GET",
              success: function(data) {
              	console.log(data.num);  
				$("#counter").append(data.num);	
              }
            });
	},

    	render: function() {
    		this.counter(); 
		this.$el.html(indexTemplate);
	}

    }); 
    
    return indexView;
});


