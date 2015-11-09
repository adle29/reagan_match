
define(['AdaptiveMindView', 'text!templates/membersLogin.html'],
function(AdaptiveMindView, loginTemplate) {
    var view = AdaptiveMindView.extend ({
    	el: $('#content'),

    	 events: {
	      	"submit form": "login"
	     },

    	 login: function() {

	      $.post('/membersLogin', {
	        password: $('input[name=password]').val()
	      }, 

	      function(data) {
	        console.log(data);
	      }).error(function(){
	        $(".alert").removeClass("hidden");
	      }).success(function(){
	      	window.location.replace('#viewInformation');
	      });

	      return false;
	    },

    	render: function() {
      		this.$el.html(loginTemplate);
    	}

    }); 
    
    return view;
});
