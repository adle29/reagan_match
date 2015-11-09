module.exports = function(config, mongoose, nodemailer, matchModule) {
  //************************ STUDENT LOGIN ************************
  var crypto = require('crypto');

//************************ MODELS ************************
  var AccountSchema = new mongoose.Schema({
    activation: { type: Boolean },
    email:     { type: String, unique: true },
    password:  { type: String },
    name: {
      first:   { type: String },
      last:    { type: String }
    },
    grade: { type: String },
    preference: { type: String },
    gender: { type: String },
    questions: { 
      simpleQuestions:   { type: Array },
      specialQuestions:    { type: Array }
    }, 
    photoUrl:  { type: String },
    matches: { 
      bestGeneral: { type: Array }, 
      bestGrade: { type: Array }, 
      worstGeneral: { type: Array },
      worstGrade: { type: Array }
    }
  });

  var SettingSchema = new mongoose.Schema ({
    numberOfQuestion: { type: String },
    specialQuestions:  { type: String },
    stringQuestions: { type: Array }
  });

  var logSchema = new mongoose.Schema ({
    logs: { type: Array }
  }); 

  var Account = mongoose.model('Account', AccountSchema);
  var Settings = mongoose.model('Settings', SettingSchema);
  var Logs = mongoose.model('logSchema', logSchema);


//************************ STUDENT LOGIN ************************
  var login = function(email, password, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    Account.findOne({email:email,password:shaSum.digest('hex')},function(err,doc){
      callback(doc);
    });
  };

//************************ CREATE STUDENT  ************************
  var register = function(student) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(student.password)
    var cryptedPassword = shaSum.digest('hex')
    student.password = cryptedPassword; 
    console.log('Registering New User');
    var user = new Account(student);
    var result = true; 
    user.save(function (err){
      if (err){ result = false; }
      else { result = true; }
    });
    return result; 
   };

//************************ GET STUDENTS *********************
  var getStudents = function(callback) {
    Account.find({}, function(err,doc) {
      if (err){      console.log('not working '+ err); }
      callback(doc);
    });
  };

var numStudents = function(callback) {
    Account.find({}, function(err,doc) {
      if (err){      console.log('not working '+ err); }
      callback(doc.length);
    });
  };

//************************ DELETE STUDENTS *********************
  var deleteStudents = function(student) {   
    if (student != null){ student.remove();  }
  };

//************************ UTILITY  ************************
  var findById = function(accountId, callback) {
    Account.findOne({ _id: accountId }, function(err,student) {
      if (err){      console.log('not working '+ err); }
      return callback(student) 
    });
  };

  var registerCallback = function(err) {
    if (err) {
      return console.log(err);
    };
    return console.log('Account Created');
  };

  var logs = function (ipAddress, data){
    var newUser = {
      address:ipAddress, 
      data:data
    };

    Logs.find({},function(err,set){
       var theLogs = set[2]; 

      var newArray = theLogs.logs;
      newArray.push(newUser);
      theLogs.logs = newArray 
      console.log("WORKING");
      theLogs.save(registerCallback);


    });

  }; 

  var getLogs = function(callback) {
   Logs.find({ },function(err,doc){
      callback(doc);
    });
  };


//************************ MATCH SETTING ************************
  var saveSettings = function(numberOfQuestion, specialQuestions, stringQuestions) {
    Settings.find({ },function(err,set){
       var mySettings = set[0]; 
       if (set[0] == null){
          if (stringQuestions = null) { stringQuestions = [] }
          var settings  = new Settings({
            numberOfQuestion: numberOfQuestion,
            specialQuestions:specialQuestions,
            stringQuestions: stringQuestions
          });
          settings.save(registerCallback); 
       }else{
          mySettings.numberOfQuestion = numberOfQuestion;
          mySettings.specialQuestions = specialQuestions;
          mySettings.stringQuestions = stringQuestions; 
                        console.log(mySettings);
                    
            mySettings.save(function(err) {
              if (err) {
                return console.log(err);
              };
                return console.log('Account was created');
            });
       }

    });


  };

  var getSettings = function(callback) {
   Settings.find({ },function(err,doc){
      callback(doc[0]);
    });
  };


//************************ MATCH STUDENTS ************************
  var matchStudents = function(callback) {
      Account.find({ gender: "1", preference: "1" }, function(err, students) {
        Settings.find({ },function(err,mySettings){

          matchProcessing(students, mySettings); 
        });//settings
      });//account

      Account.find({ gender: "2", preference: "2" }, function(err, students) {
        Settings.find({ },function(err,mySettings){
          matchProcessing(students, mySettings); 
        });//settings
      });//account

      Account.find({ $or: [ { $and: [ { gender: "1" }, { preference: "2" } ] } , { $and: [ { gender: "2" }, { preference: "1" } ] }]  }, function(err, students) {
        Settings.find({ },function(err,mySettings){
          for ( var i = 0; i < students.length; i++){
            var studentA = students[i];
            var matchedStudents;
                        studentA.matches = {
              bestGeneral : [],
              bestGrade : [],
              worstGeneral : [],
              worstGrade : []
            };

            for (var j = 0; j < students.length; j++){
                var studentB = students[j];
                if ( studentA.gender != studentB.gender && studentA._id != studentB._id  ) {
                    studentA = matchModule.match(studentA, studentB, mySettings[0].numberOfQuestion, mySettings[0].specialQuestions );
                }
            }
               matchedStudents = studentA;
              if (matchedStudents != null ){
                 matchedStudents.matches.bestGeneral.sort(function(a, b){
                 var nameA=a.percentage, nameB=b.percentage;
                     if (nameA < nameB) //sort string ascending
                      return 1; 
                     if (nameA > nameB)
                      return -1;
                     return 0; //default return value (no sorting)        
                 }); 
                 var insertList = matchModule.cutMatch(matchedStudents.matches.bestGeneral); 
                 matchedStudents.matches.bestGeneral = insertList; 

                 matchedStudents.matches.bestGrade.sort(function(a, b){
                 var nameA=a.percentage, nameB=b.percentage;
                     if (nameA < nameB) //sort string ascending
                      return 1; 
                     if (nameA > nameB)
                      return -1;
                     return 0; //default return value (no sorting)        
                 }); 
                 insertList = matchModule.cutMatch(matchedStudents.matches.bestGrade); 
                 matchedStudents.matches.bestGrade = insertList; 

                 matchedStudents.matches.worstGeneral.sort(function(a, b){
                 var nameA=a.percentage, nameB=b.percentage;
                     if (nameA > nameB) //sort string ascending
                      return 1; 
                     if (nameA > nameB)
                      return -1;
                     return 0; //default return value (no sorting)        
                 }); 
                 insertList = matchModule.cutMatch(matchedStudents.matches.worstGeneral); 
                 matchedStudents.matches.worstGeneral = insertList; 

                 matchedStudents.matches.worstGrade.sort(function(a, b){
                 var nameA=a.percentage, nameB=b.percentage;
                     if (nameA > nameB) //sort string ascending
                      return 1; 
                     if (nameA > nameB)
                      return -1;
                     return 0; //default return value (no sorting)        
                 }); 
                 insertList = matchModule.cutMatch(matchedStudents.matches.worstGrade); 
                 matchedStudents.matches.worstGrade = insertList; 
                 matchedStudents.save(); 
               }
          }//for

        });//settings
      });//account

      Account.find({ $or: [ {  $and: [ { gender: "1" }, { preference: "3" } ] } , { $and:  [ { gender: "2" }, { preference: "3" } ] }] }, function(err, students) {
        Settings.find({ },function(err,mySettings){
          matchProcessing(students, mySettings); 
        });//settings
      });//account




      callback();
  };

  var matchProcessing = function (students, mySettings ) {
    
      for ( var i = 0; i < students.length; i++){
        var studentA = students[i];
        var matchedStudents;
        studentA.matches = {
          bestGeneral : [],
          bestGrade : [],
          worstGeneral : [],
          worstGrade : []
        };

        for (var j = 0; j < students.length; j++){        
            var studentB = students[j]; 
          if ( studentA._id != studentB._id ){
            studentA = matchModule.match(studentA, studentB, mySettings[0].numberOfQuestion, mySettings[0].specialQuestions );
          }

        }
        matchedStudents = studentA;

        if (matchedStudents != null){
         matchedStudents.matches.bestGeneral.sort(function(a, b){
         var nameA=a.percentage, nameB=b.percentage;
             if (nameA < nameB) //sort string ascending
              return 1; 
             if (nameA > nameB)
              return -1;
             return 0; //default return value (no sorting)        
         }); 
         var insertList = matchModule.cutMatch(matchedStudents.matches.bestGeneral); 
         matchedStudents.matches.bestGeneral = insertList; 

         matchedStudents.matches.bestGrade.sort(function(a, b){
         var nameA=a.percentage, nameB=b.percentage;
             if (nameA < nameB) //sort string ascending
              return 1; 
             if (nameA > nameB)
              return -1;
             return 0; //default return value (no sorting)        
         }); 
         insertList = matchModule.cutMatch(matchedStudents.matches.bestGrade); 
         matchedStudents.matches.bestGrade = insertList; 

         matchedStudents.matches.worstGeneral.sort(function(a, b){
         var nameA=a.percentage, nameB=b.percentage;
             if (nameA > nameB) //sort string ascending
              return 1; 
             if (nameA > nameB)
              return -1;
             return 0; //default return value (no sorting)        
         }); 
         insertList = matchModule.cutMatch(matchedStudents.matches.worstGeneral); 
         matchedStudents.matches.worstGeneral = insertList; 

         matchedStudents.matches.worstGrade.sort(function(a, b){
         var nameA=a.percentage, nameB=b.percentage;
             if (nameA > nameB) //sort string ascending
              return 1; 
             if (nameA > nameB)
              return -1;
             return 0; //default return value (no sorting)        
         }); 
         insertList = matchModule.cutMatch(matchedStudents.matches.worstGrade); 
         matchedStudents.matches.worstGrade = insertList; 


         matchedStudents.save( function (err) {  
          if (err) {
            return console.log(err);
          };
          return console.log('');
         }); 
       
       }  

      }//for
  };

 


  var eraseMatches = function(callback) {
      Account.find({ }, function(err, students) {
        for ( var i = 0; i < students.length; i++){
            var studentA = students[i];

            studentA.matches = {
              bestGeneral : [],
              bestGrade : [],
              worstGeneral : [],
              worstGrade : []
            };

            studentA.save(); 
        }
      });//account
      callback();
  };


   var findMatch = function(searchMatch, callback ) {
    var searchRegex = new RegExp(searchMatch, 'i');
    Account.find({
        $or: [
          { 'name.first': { $regex: searchRegex } },
          { 'name.last': { $regex: searchRegex } }
        ]
    }, callback);
   };



//************************ FUNCTION ************************
  return {
    register: register,
    getStudents: getStudents, 
    deleteStudents: deleteStudents, 
    numStudents: numStudents , 
    findById: findById, 
    matchStudents: matchStudents, 
    eraseMatches: eraseMatches, 
    findMatch: findMatch, 
    logs:logs, 
    getLogs:getLogs,
    saveSettings: saveSettings, 
    getSettings: getSettings, 
    login: login,
    Account: Account
  }
}
