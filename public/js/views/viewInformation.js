
define(['AdaptiveMindView', 'text!templates/viewInformation.html'],
function(AdaptiveMindView, indexTemplate) {
    var indexView = AdaptiveMindView.extend ({
    	el: $('#content'),

        events: {
            "click #activate":"activate",
            "click #match": "match", 
            "click #refresh": "refresh",
            "click #eraseMatches": "eraseMatches",
            "click #search": "searches",
            "click #clear": "refresh"
        }, 

        initialize: function(){
            this.howManyStudents = 0; 
        },

        populateUpdate: function (){
            var that = this; 
            setInterval(function(){
                that.populate(); 
            },10000);
        },

        match: function (){
          $.get('/match', function(data) {
             console.log(data); 
                $(".alert").removeClass("alert-danger").addClass("alert-success");
                $(".alert").text("**Students where matched!**"); 
                $(".alert").show(); 
          });


        },

        eraseMatches: function (){
            console.log("erased matches"); 
           $.get('/eraseMatches', function(data) {
             console.log(data); 
                $(".alert").removeClass("alert-success").addClass("alert-danger");
                $(".alert").text("**Student Matches were erased!**"); 
                $(".alert").show(); 
          });
        },

        refresh: function (){
            var that = this; 
            $.get('/getMoreStudents', function(data) {
                that.populate(); 
            });
        },

        activate: function (id){
            var changeActivation = true;  
            var correctId = id.substring(1,id.length ); 

            if ( $("#"+id ).find('span').hasClass('no')){
                $("#"+id + " span" ).replaceWith("<span class='yes'><i  class='fa fa-check oranges'> </i></span>");
                console.log(" deactivated");
                changeActivation = true

            } else{
                $("#"+id + "  span" ).replaceWith("<span class='no'><i class='greens fa fa-thumbs-up'> </i></span> ");
                console.log("activated");
                changeActivation = false; 
            }

            $.post('/activation', {
                studentId: correctId,
                activation: changeActivation
            }, 
            function(student) {
                console.log(student);
            });
        },

        searches: function (){
            var that = this;
            var text = $('#student').val(); 
            if (text != ""){
                $.post('/search', {
                      searchData: text

                    }, function (data){ 
                        console.log("here", data);
                        $(".alert").hide();
                        $('#addingList').empty(); 
                        if (data != null ){
                            for(var i = 0; i < data.length; i++){
                                that.item(data[i]);
                            }
                        }
                        else {
                            $(".alert").text('No contacts found.');
                            $(".alert").slideDown();
                        }

                    }).error(function(){
                  
                        $(".alert").text('No contacts found.');
                        $(".alert").slideDown();
                });
            }
            else {
               $('#addingList').empty(); 
               that.populate();

            }

        },

    	populate: function (){
            var that = this; 
            $(".alert").text("**Retrieving Matches!**"); 
               $(".alert").slideDown();
            $.get('/addInformation', function(data) {

                var students = data;

                students.sort(function(a, b){
                    if(a.name.first < b.name.first) return -1;
                    if(a.name.first > b.name.first) return 1;
                    return 0;
                })

                var numOfStudentsAppended = 0; 
                var i = 0; 

                if (that.howManyStudents == 0 ){
                    that.howManyStudents = students.length; 
                    numOfStudentsAppended = that.howManyStudents; 

                }
                else if (students.length ==  that.howManyStudents ){
                    numOfStudentsAppended = 0; 
                    that.howManyStudents = students.length;

                }
                else {
                    numOfStudentsAppended = students.length; 
                    i = that.howManyStudents; 
                    that.howManyStudents = students.length;

                }
                for (; i< numOfStudentsAppended; i++){
                    var student = students[i]; 
                    that.item(student);
                }


                if ( $("#addingList li").size() <students.length){
                    i = 0; 
                    numOfStudentsAppended = students.length ;
                    for (; i< numOfStudentsAppended; i++){
                        var student = students[i]; 
                        that.item(student);
                    }
                    console.log("exception");
                }

               $(".alert").text('Users in View ' + data.length);

            });
        }, 

        item: function (student){ 

            if (student != null){
                var that = this; 
                var cl = "<br class='hidden-sm hidden-md hidden-lg'>";
                var html = "<li class='list-group-item' id='p"+student._id+"' >"+
                "<strong><p>" + student.name.first + " " + student.name.last +"</strong> | " + student.grade+ " | "+student.email+cl+ 
                "<a class=' pull-right btn btn-default ' target='_blank' href='#profile/"+student._id+"'> <i class='purples fa fa-search'></i></a>  "+
                "<a class='pull-right'>&nbsp; </a> <a class='pull-right btn btn-default  reds click deleteStudent' id='"
                +student._id+"'> <i class='trueRed fa fa-trash-o'> </i></a>  <a class='pull-right'>&nbsp; </a> ";

                if (student.activation == false ){
                    html += "  <a class='activate pull-right  btn btn-default' id='s"+student._id+"'> "+
                        "<span class='no'><i class='greens fa fa-thumbs-up'> </i></span>   </a> </p> "+cl+"</li>"; 
                }
                else {
                    html += "<a class='btn btn-default pull-right  ' id='s"+student._id+"'>"+
                    " <span class='yes'><i  class='fa fa-check oranges'> </i></span></a> </p>"+cl+"</li>"; 
                }


                $("#addingList").append(html);

                $("#"+student._id).click(function(){
                    that.delete($(this).attr("id") );    
                });

                $("#s"+student._id).click(function(){
                    that.activate($(this).attr("id"));    
                });
                
                $(".panel-body").hide();
            }
        }, 

        delete: function (id){
            var that = this; 
            if ( id != null){
                $.ajax({
                url: '/addInformation' ,
                type: 'DELETE',
                data: {
                  studentId: id
                }}).fail(function onError() {
                    console.log('error deleting student');
                });
                that.howManyStudents--; 

                if (that.howManyStudents == 0) { 
                    $(".panel-body").show();
                    $(".set").removeClass("disabled"); 
                }
                else {
                    $(".set").addClass("disabled");
                    console.log("yes"); 
                }

                var myId="#p"+id;
                $(myId).remove();
                console.log('deleting');
            }   
        },

    	render: function(run) {
    		var that = this; 
    		$.ajax("/viewInformation", {
		      method: "GET",
		      success: function() {

		        that.$el.html(indexTemplate);
                that.populate(); 
		      },
		      error: function(data) {
		      	window.location.hash = 'membersLogin';
		      }
		    });
    	}

    }); 
    
    return indexView;
});


