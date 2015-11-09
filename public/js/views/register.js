
define(['AdaptiveMindView', 'text!templates/register.html'],
function(AdaptiveMindView, indexTemplate) {
    var indexView = AdaptiveMindView.extend ({
      el: $('#content'),

      events: {
            "submit form": "add"
      }, 


        add: function (){
            var that = this;
            var firstName = $('input[name=firstName]').val(); 
            var lastName = $('input[name=lastName]').val(); 
            var email = $('input[name=email]').val(); 
            var password = $('input[name=password]').val(); 
            var grade = $('#grade').val(); 
            var gender = $('#gender')[0].selectedIndex; 
            var preference = $('#preference')[0].selectedIndex; 
            var questions = {
              simpleQuestions :[],
              specialQuestions :[]
            };

            for (var i = 0; i < that.simpleQuestions; i++){
                var num = i+1; 
                var id = "#"+num; 
                questions.simpleQuestions.push( $(id)[0].selectedIndex );
            }

            for (var i = 0; i < that.specialQuestions; i++){
                var num = i+1; 
                var ids = "#s"+num; 
                var ids2 = "#s2"+num; 
                var value = $(ids2)[0].selectedIndex;
                if (value == 1){ value = 1; }
                else if (value == 2){ value = 10;}
                else if (value == 3){ value = 20;}
                else if (value == 4){ value = 50;}
                else { value = 250;}
                var doubleAnswer = [$(ids)[0].selectedIndex , value ]; 
                console.log(doubleAnswer);
                questions.specialQuestions.push( doubleAnswer );
            }

            var student = {
                activation: true, 
                name: {
                    first: firstName,
                    last: lastName
                },
                email: email,
                password: password,
                grade: grade,
                gender: gender,
                preference: preference,
                questions: questions,
                photoUrl:  ""
            };

            if ( this.answerChecker() ) {

              console.log($('input[name=code]').val()); 
                $.post('/register', {
                  student: student,
                  code: $('input[name=code]').val()
                }, 
                function(student) {
                    console.log(student);
                    window.location.hash = 'thanks';
                }).error(function(err){

                  $(".alert").empty(); 
                  $(".alert").append("**Error: Possible duplicate email or Wrong verification code **"); 
                  $(".alert").show(); 
                  $("html, body").animate({ scrollTop: 0 }, "slow");
                });
            }
            return false; 
            
        }, 

      answerChecker: function (){
        if ( $("input[name=email]").val() == ""){
          $(".alert").empty(); 
          $(".alert").append("**You did not enter an email!**"); 
          $(".alert").show(); 
          $("html, body").animate({ scrollTop: 0 }, "slow");
          return false; 
        }

        else if ( $("input[name=email]").val().length > 30){
          $(".alert").empty(); 
          $(".alert").append("**Your email is very long!**"); 
          $(".alert").show(); 
          $("html, body").animate({ scrollTop: 0 }, "slow");
          return false; 
        }

         else if ( $("input[name=email]").val() != $("input[name=confirmEmail]").val() ){
          $(".alert").empty(); 
          $(".alert").append("**Your email does not match!**"); 
          $(".alert").show(); 
          $("html, body").animate({ scrollTop: 0 }, "slow");
          return false;
        }
         else if ( $("input[name=password]").val() == ""){
          $(".alert").empty(); 
          $(".alert").append("**You did not enter a password!**"); 
          $(".alert").show(); 
          $("html, body").animate({ scrollTop: 0 }, "slow");
          return false; 
        }
        else if ( $("input[name=password]").val() != $("input[name=confirmPassword]").val() ){
          $(".alert").empty(); 
          $(".alert").append("**Your password does not match!**"); 
          $(".alert").show(); 
          $("html, body").animate({ scrollTop: 0 }, "slow");
          return false;
        } 
        else if ( $("input[name=firstName]").val() == ""){
          $(".alert").empty(); 
          $(".alert").append("**You did not enter your first name!**"); 
          $(".alert").show(); 
          $("html, body").animate({ scrollTop: 0 }, "slow");
          return false; 
        }
        else if ( $("input[name=firstName]").val().length > 25){
          $(".alert").empty(); 
          $(".alert").append("**Your name is very long!**"); 
          $(".alert").show(); 
          $("html, body").animate({ scrollTop: 0 }, "slow");
          return false; 
        }
        else if ( $("input[name=lastName]").val() == ""){
          $(".alert").empty(); 
          $(".alert").append("**You did not enter your last name!**"); 
          $(".alert").show(); 
          $("html, body").animate({ scrollTop: 0 }, "slow");
          return false; 
        } 
        else if ( $("input[name=lastName]").val().length > 25){
          $(".alert").empty(); 
          $(".alert").append("**Your last name is very long!**"); 
          $(".alert").show(); 
          $("html, body").animate({ scrollTop: 0 }, "slow");
          return false; 
        }
        else {
          var myReturn  = true; 
          var theBreak = false; 
            $("select").each(function() {
                
                if( $(this)[0].selectedIndex == 0 && !theBreak ){
                  console.log("AHHH");
                  $(".alert").empty(); 
                  $(".alert").append("** You did not answer a base, simple, or special question! **"); 
                  $(".alert").show(); 
                  $("html, body").animate({ scrollTop: 0 }, "slow");
                  theBreak = true; 
                  myReturn = false; 
                }

            });
          
            return myReturn;
        }

      }, 

      counter: function(){
	$.get('/studentStats', function(data) {
	  var numStudents = data.males + data.females;
	  $("counter").append(numStudents);
	});

      },

      render: function() {
            console.log("register");
             var that = this; 
         $.post('/loginPic', {
            student: "verification"
          }, 
          function(data) {

            that.$el.html(indexTemplate);
            $(".alert").hide(); 
            $.get('/settings', function(data) {
                var settings = data; 
                that.simpleQuestions = settings.numberOfQuestion; 
                that.specialQuestions = settings.specialQuestions; 

                for (var i = 0; i < settings.numberOfQuestion; i++ ){
                    addSimpleQuestions (i, settings.stringQuestions[0][i] ); 
                }

                for (var i = 0; i < settings.specialQuestions; i++ ){
                    addSpecialQuestions (i, settings.stringQuestions[1][i] ); 
                }
            });


                  console.log(data);
              var canvas = document.getElementById("myCanvas");;
              var context = canvas.getContext("2d");
              context.font="20px Georgia";

              for (var i =0; i < data.num.length; i++)
                context.fillText(data.num[i],10,20+20*i);

              for (var i =0; i < 10; i++){
                context.beginPath();
                context.fillStyle = 'blue';
                context.moveTo(i, 15);
                context.lineTo(30*i, 50);

                context.moveTo(i, 40);
                context.lineTo(30*i, 100);

                context.moveTo(i, 80);
                context.lineTo(30*i, 150);

                context.stroke();
              }
            });
        

      }

    }); 
    
    return indexView;
});


function addSimpleQuestions (i, questions){
     i++;
     var options = ""; 

     for ( var j = 0; j < questions.answers.length; j++){ 
        options += "<option>"+questions.answers[j]+"</option>"; 
     }
     var html = "<p>"+i+ ". "+questions.question +" </p> <select class='form-control ' id='"+i+ "'>"+
                              "<option>Choose an answer</option>"+
                              options+"</select><br/>";
     $("#simpleQuestions").append(html); 
}

function addSpecialQuestions (i, questions){
     i++;
     var options = ""; 
     for ( var j = 0; j < questions.answers.length; j++){ 
        options += "<option>"+questions.answers[j]+"</option>"; 
     }
     var html = "<p>"+i+ ". "+questions.question +" </p> <select class='form-control ' id='s"+i+ "'>"+
                              "<option>Choose an answer</option>"+
                              options+"</select><br/>"+
                "</select>"+
                "<p>How important is this question to you? </p><select class='form-control ' id='s2"+i+ "'>"+
                              "<option>Choose an answer</option>"+
                              "<option>I do not care</option>"+
                              "<option>Little Important</option>"+
                              "<option>Moreover Important</option>"+
                              "<option>Really Important</option>"+
                              "<option>Extremely Important</option>"+
                          "</select> <br/>";
     $("#specialQuestions").append(html); 
}


