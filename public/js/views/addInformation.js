
define(['AdaptiveMindView', 'text!templates/addInformation.html'],
function(AdaptiveMindView, indexTemplate) {
    var indexView = AdaptiveMindView.extend ({
    	el: $('#content'),

    	events: {
    		"click #delete":"delete",
    		"click #add":"open",
            "click #match": "add",
    	}, 

    	open: function (){

    		$("#addingInfoForm").toggle();
    	},

        add: function (){
            var that = this;
            var firstName = $('input[name=firstName]').val(); 
            var lastName = $('input[name=lastName]').val(); 
            var email = $('input[name=email]').val(); 
            var grade = $('#grade').val(); 
            var gender = $('#gender').val(); 
            var questions = {
              simpleQuestions :[],
              specialQuestions :[]
            };

            for (var i = 0; i < that.simpleQuestions; i++){
                var num = i+1; 
                var id = "#"+num; 
                console.log(id);
                questions.simpleQuestions.push( $(id).val() );
            }

            for (var i = 0; i < that.specialQuestions; i++){
                var num = i+1; 
                var ids = "#s"+i+1; 
                var ids2 = "#s2"+i+1; 
                var doubleAnswuer = [$(ids).val(), $(ids2).selectedIndex ]; 
                questions.specialQuestions.push(  );
            }

            /*$.post('/addInformation', {
                email: email, 
                firstName: firstName,
                lastName: lastName,
                grade: grade,
                gender: gender
            }, 

            function(student) {
                console.log(student);
                that.item(student); 
                $(".alert").show();
                $('#myForm')[0].reset();
            }).error(function(err){
                console.log(err);
            });
*/
            var student = {
                name: {
                    first: firstName,
                    last: lastName
                },
                email: email,
                grade: grade,
                gender: gender,
                questions: questions
            };

            console.log(student); 

            //alert
        }, 

        populate: function (){
            var that = this; 
            $.get('/addInformation', function(data) {
                console.log("here", data);
                var students = data;
                for (var i = 0; i< students.length; i++){
                    var student = students[i]; 
                    that.item(student);
                }
                if (students.length == 0) { $(".panel-body").append("No Students Yet!"); }
            });
        }, 

        item: function (student){ 
            if (student != null){
                                var that = this; 
                var html = "<li class='list-group-item' id='p"+student._id+"' >"+
                "<strong><p>" + student.name.first + " " + student.name.last +"</strong> | " + student.grade+ "</p>"+
                "<a class='reds click editStudent' id='"+student._id+"'>Edit</a> &nbsp;"+
                "<a class='reds click deleteStudent' id='"+student._id+"'>Delete</a>"+
                "</li>";

                $("#addingList").append(html);
                
                $(".deleteStudent").click(function(){
                    that.delete($(this).attr("id") );    
                });
                $(".panel-body").remove();
            }

        }, 

    	delete: function (id){
            if ( id != null){
                $.ajax({
                url: '/addInformation' ,
                type: 'DELETE',
                data: {
                  studentId: id
                }}).fail(function onError() {
                    console.log('error deleting student');
                });

                var myId="#p"+id;
                $(myId).remove();
                console.log('deleting');
            }   

    	},

    	update: function (){

    	},

    	render: function(run) {
    		var that = this; 
    		$.ajax("/viewInformation", {
		      method: "GET",
		      success: function() {
		        that.$el.html(indexTemplate);
		        $("#addingInfoForm").hide();
                $(".alert").hide();
                that.populate();
                $(window).resize(function(){
                    reSize ();
                }); 
                reSize ();
		      },
		      error: function(data) {
		      	window.location.hash = 'membersLogin';
		      }
		    });

            $.get('/settings', function(data) {
                var settings = data[0]; 
                that.simpleQuestions = settings.numberOfQuestion; 
                that.specialQuestions = settings.specialQuestions; 

                for (var i = 0; i < settings.numberOfQuestion; i++ ){
                    addSimpleQuestions (i); 
                }

                for (var i = 0; i < settings.specialQuestions; i++ ){
                    addSpecialQuestions (i); 
                }
            });
    	}

    }); 
    
    return indexView;
});

function reSize (){
    if ($(window).width() < 400 ){
          $(".lab").removeClass("col-xs-2");
          $("col-xs-8").removeClass("col-xs-8").addClass("col-xs-4");
          console.log("working");
        }else{
           $("col-xs-8").addClass("col-xs-8").removeClass("col-xs-4");
            $(".lab").addClass(".col-xs-2");
        }
}

function addSimpleQuestions (i){
     i++;
     var html = "<p>Q"+i+ ". </p> <select class='form-control ' id='"+i+ "'>"+
                              "<option>1</option>"+
                              "<option>2</option>"+
                              "<option>3</option>"+
                              "<option>4</option>"+
                              "<option>5</option>"+
                "</select>";
     $("#simpleQuestions").append(html); 
}

function addSpecialQuestions (i){
     i++;
     var html = "<p>Q"+i+ ". </p> <select class='form-control ' id='s"+i+ "'>"+
                              "<option>1</option>"+
                              "<option>2</option>"+
                              "<option>3</option>"+
                              "<option>4</option>"+
                              "<option>5</option>"+
                "</select>"+
                "<select class='form-control ' id='s2"+i+ "'>"+
                              "<option>Does not care</option>"+
                              "<option>Little care</option>"+
                              "<option>Cares Moreover</option>"+
                              "<option>Really Cares</option>"+
                              "<option>Really Really Cares</option>"+
                          "</select>";
     $("#specialQuestions").append(html); 
}


