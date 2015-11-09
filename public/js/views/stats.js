
define(['AdaptiveMindView', 'text!templates/stats.html'],
function(AdaptiveMindView, indexTemplate) {
    var indexView = AdaptiveMindView.extend ({
    	el: $('#content'),

        events: {
            "click #refresh": "refresh",
            "click #logs": "logs"
        }, 

        initialize: function(){
            this.howManyStudents = 0; 
        },

        refresh: function (){
            $(".info").text("");
            this.numberOfUsers();
        },

        logs: function (){
              $.get('/logs', function(data) {
                  console.log(data);
                // $('input[name=questions]').val(myInfo.numberOfQuestion); 
              });
        }, 

        numberOfUsers: function (){
            $(".alert").text("Retrieving Stats"); 
            $(".alert").show(); 
            $.ajax("/studentStats", {
              method: "GET",
              success: function(data) {
                console.log(data);
                $("#totalStudents").append("<strong>Total Users: </strong> "+ data.totalStudents); 
                $("#totalMaleStudents").append("<strong>Male Users: </strong> "+ data.males);
                $("#totalFemaleStudents").append("<strong>Female Users: </strong> "+ data.females);
                $("#totalFreshmans").append("<strong>Freshman Users: </strong> "+ data.freshman);
                $("#totalSophomores").append("<strong>Sophomores Users: </strong> "+ data.sophomore);
                $("#totalJuniors").append("<strong>Juniors Users: </strong> "+ data.junior);
                $("#totalSeniors").append("<strong>Seniors Users: </strong> "+ data.senior);
                $(".alert").text("Stats Arrived"); 
              }
            });
        }, 


    	render: function(run) {
    		var that = this; 
    		$.ajax("/viewInformation", {
		      method: "GET",
		      success: function() {

		        that.$el.html(indexTemplate);
                $(".alert").hide(); 
                that.numberOfUsers();

		      },
		      error: function(data) {
		      	window.location.hash = 'membersLogin';
		      }
		    });
    	}

    }); 
    
    return indexView;
});


