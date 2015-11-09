var studentA = {
  simpleQuestions :[2,2,5,3,2],
  specialQuestions :[[3, 200], [1, 50], [3, 10], [4, 10], [1, 200]]
};

var studentB = {
  simpleQuestions :[1,5,4,3,2],
  specialQuestions :[[5, 10], [4, 50], [3, 10], [2, 10], [1, 200]]
};
var numQuestions = 5; 

//Questions(studentA, studentB); 

function Questions (studentA, studentB){
  var percentagAB = 0, percentageAB2; 
  var totalAB = 0; 
  
  for (var i = 0; i < numQuestions; i++){
      var question1 = studentA.simpleQuestions[i];
      var question2 = studentB.simpleQuestions[i];
      percentagAB += simpleQuestions (question1, question2); 
  }
  percentagAB = Math.round( (percentagAB/ numQuestions)*100*0.3 );
  
  totalAB = Math.round((deepQuestions (studentA.specialQuestions, studentB.specialQuestions) )*100*0.7); 
  percentageAB2 = percentagAB + totalAB; 
  console.log("Match Percentage: " + percentagAB + " + " + totalAB + " = "+ percentageAB2 );
}

function simpleQuestions (question1, question2) {
  if ( question1 == question2){
   return 1;  
  }
  else {
   return 0;  
  }
}

function deepQuestions (questionsA, questionsB){
    var percentageA = 0, percentageB = 0; 
    var bottomA = 0, bottomB = 0; 
    var topA = 0, topB = 0; 
    var finalPercentage = 0; 

    for (var j = 0; j < numQuestions; j++){
      var question1 = (questionsA[j])[0];
      var question2 = (questionsB[j])[0];
      var value1 = (questionsA[j])[1];
      var value2 = (questionsB[j])[1];

      if ( question1 == question2){
        topA += value2; 
        topB += value1; 
      }
      bottomA += value2;
      bottomB += value1;
       
    }
    
    percentageA = topA/bottomA;
    percentageB = topB/bottomB;
    finalPercentage =  Math.pow(percentageA*percentageB, 1/numQuestions) ;
    return finalPercentage; 
}




