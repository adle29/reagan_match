
define(['AdaptiveMindView', 'text!templates/settings.html'],
function(AdaptiveMindView, indexTemplate) {
    var View = AdaptiveMindView.extend ({
      	el: $('#content'),

      	events: {
              "submit form": "process",
              "click #add": "addQuestionsAlone"
      	},

        info: function (){
          var that = this; 
        $.get('/settings', function(data) {
              var myInfo = data;
             $('input[name=questions]').val(myInfo.numberOfQuestion); 
             $('input[name=specialQuestions]').val(myInfo.specialQuestions); 
             that.addQuestionsAlone (myInfo.stringQuestions); 
          });
        }, 

        addQuestionsAlone: function (stringQuestions){
          console.log("questions alone");
          $("#stringQuestions").empty(); 
          var that = this; 
          var numSimpleQuestions = $('input[name=questions]').val(); 
          var numSpecialQuestions = $('input[name=specialQuestions]').val(); 
          if ( numSimpleQuestions != 0 && numSimpleQuestions != ""){

              for ( var i = 0; i < numSimpleQuestions; i++){
                  var num = i+1; 
                  var html = "<p>"+ num+". Simple Question</p> <input placeholder='question' class='form-control' type='text' name='"+i+"' />";
                   html += "<input placeholder='answers'  class='form-control' type='text' name='a"+i+"' /><br/>";
                 $("#stringQuestions").append(html); 
               }

               for ( var i = 0; i < numSpecialQuestions; i++){
                  var num = i+1; 
                  var html = "<p>"+num+". *Special Question*</p> <input placeholder='questions' class='form-control' type='text' name='s"+i+"' />";
                   html += "<input class='form-control' placeholder='answers' type='text' name='as"+i+"' /> <br/>";
                  $("#stringQuestions").append(html); 
               } //FOR

              if ( stringQuestions != null ){
                if (stringQuestions.length != null){
                  console.log(stringQuestions); 
                  that.addQuestions(numSimpleQuestions, numSpecialQuestions, stringQuestions);
                }
              }
          }


        },

        addQuestions: function (questions1, question2, stringQuestions){  
             console.log("questions ");
         for ( var i = 0; i < questions1; i++){
                var id = "input[name="+ i + "]"; 
                var id2 = "input[name=a"+i + "]"; 
            var oneQuestion = stringQuestions[0][i];
            $(id).attr("value", oneQuestion.question);
            $(id2).attr("value", oneQuestion.answers); 
         }

         for ( var i = 0; i < question2; i++){
                var id = "input[name=s"+ i + "]"; 
                var id2 = "input[name=as"+i + "]"; 
            var oneQuestion = stringQuestions [1][i];
            $(id).attr("value", oneQuestion.question);
            $(id2).attr("value", oneQuestion.answers); 
         }
        },

        getQuestions: function (questions1, questions2){      
           console.log("questions get");
            var simpleQuestions = []; 
            var specialQuestions = []; 
            var totalQuestions = []; 

             for ( var i = 0; i < questions1; i++){
                var id = "input[name="+ i + "]"; 
                var id2 = "input[name=a"+i + "]"; 
                console.log("here", $(id).val()); 
                var questionAnswersObject = {
                    question : $(id).val(),
                    answers : ($(id2).val()).split(",")
                };
                console.log( $(id).val() ); 
                simpleQuestions.push(questionAnswersObject); 
             }

             for ( var i = 0; i < questions2; i++){
                var id = "input[name=s"+ i + "]"; 
                var id2 = "input[name=as"+i + "]"; 
                var questionAnswersObject = {
                  question : $(id).val(),
                  answers : ($(id2).val()).split(",")
                };

                specialQuestions.push(questionAnswersObject); 
             }
            
             totalQuestions.push(simpleQuestions); 
             totalQuestions.push(specialQuestions); 
             return totalQuestions; 
        },

        process: function (){
          var that = this;
          var q1 = $('input[name=questions]').val(); 
          var q2 = $('input[name=specialQuestions]').val(); 
          var q3 = this.getQuestions(q1, q2);
          console.log (q3); 

          $.post('/settings', {
            questions: q1,
            specialQuestions: q2,
            stringQuestions: q3
          }, 

          function(data) {
            console.log(data);
          }).error(function(err){
            console.log(err);
          });

           return false;
        },

    	render: function() {

      		var that = this; 
            $.ajax("/viewInformation", {
              method: "GET",
              success: function() {
                that.$el.html(indexTemplate);
                $("#addingInfoForm").hide();
                 that.info(); 
              },
              error: function(data) {
                window.location.hash = 'memberslogin';
              }
            });
    	}

    }); 
    
    return View;
});


