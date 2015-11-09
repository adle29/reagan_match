var express     = require("express");
var app         = express();
var nodemailer  = require('nodemailer');
var matchModule = require('match');
var MemoryStore = require('connect').session.MemoryStore;
//var dbPath      = 'mongodb://localhost/matches'; 
var dbPath      = 'mongodb://heroku_app20957605_A:YkLhvAkeCiNlgwbxmqMyQdJscBmmiUkN@ds061288.mongolab.com:61288/heroku_app20957605';

// Import the data layer
var mongoose = require('mongoose');
var config = {
  mail: require('./config/mail')
};



// Import the models
var models = {
  Account: require('./models/Account')(config, mongoose, nodemailer, matchModule)
};

app.configure(function(){
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
  app.use(express.limit('1mb'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: "AdaptiveMind secret key", store: new MemoryStore()}));
  mongoose.connect(dbPath, function onMongooseError(err) {
    if (err) throw err;
  });
});

//************************ INFRAESTRUCTURE (DO NO EDIT) ************************
app.get('/', function(req, res){
  res.render('index.jade', {loggedIn: false});
});

//************************LOG IN FOR STUDENTS ************************
app.post('/login', function(req, res) {
  console.log('Student Login Request');
  var email = req.param('email', null);
  var password = req.param('password', null);

  models.Account.login(email, password, function(account) {
    if ( !account ) {
      res.send(401);
      console.log('login was NOT successful');
      return;
    }
    req.session.studentLogIn = true;
    req.session.accountId = account._id;
    res.send(account);
  });
});

app.get('/profile/:id', function(req, res) {
  var studentId = req.params.id;

  if ( req.session.studentLogIn ) {
      models.Account.findById(req.session.accountId, function (studentAccount){
        res.send(studentAccount);
      });
  } else if (req.session.memberLogin) {
      console.log("ID ", studentId);
      models.Account.findById(studentId, function (studentAccount){
        res.send(studentAccount);
      });

  } else {
    res.send(401);
  }
});

//************************STUDENT VERFICATION & ACCOUNT APPROVAL ************************


//************************LOG IN FOR MEMBERS ************************
app.post('/membersLogin', function(req, res) {
  console.log('Member Login Request');
  var password = req.param('password', null);
  var myPassword = "megustas2014";

  if ( password != myPassword ) {
    req.session.memberLogin = false;
    res.send(401);
  }
  else { 
    req.session.memberLogin = true;
    req.session.numberOfUsers = 10; 
    console.log(req.session.memberLogin, "You are logged");
    res.send(200);
  }
});

//************************ MEMBER VERIFICATION ************************
app.get('/viewInformation', function(req, res) {
  if ( req.session.memberLogin ) {
    res.send(200);
  } else {
    res.send(401);
  }
});

//************************ LOG OUT ************************
app.get('/logOut', function(req, res) {
    req.session.memberLogin = false; 
    req.session.studentLogIn = false; 
    res.send(200);
});

//************************ SETTINGS OF THE MATCH ************************
app.get('/settings', function(req, res) {
    console.log("get settings here");

  models.Account.getSettings (function (data){
    res.send(data);
  } );
});

app.post('/loginPic', function(req, res) {
    var num2 = Math.floor(Math.random()*90000) + 10000; 
    req.session.pic =  num2.toString();
    console.log("CODE Activated", req.session.pic);
    var theNum = digitToText(req.session.pic);
    var num = { num: theNum };
    res.send(num); 
});

function digitToText (num){
  var digitsArray = num.split("");
  var textArray = []; 
  console.log(digitsArray);
  for (var i = 0; i < digitsArray.length; i++ ){
    if (digitsArray[i] == "0"){
      textArray.push("zero");
    }
    else if (digitsArray[i] == 1){
      textArray.push("one");
    }
    else if (digitsArray[i] == "2"){
      textArray.push("two");
    }
    else if (digitsArray[i] == "3"){
      textArray.push("three");
    }
    else if (digitsArray[i] == "4"){
      textArray.push("four");
    }
    else if (digitsArray[i] == "5"){
      textArray.push("five");
    }
    else if (digitsArray[i] == "6"){
      textArray.push("six");
    }
    else if (digitsArray[i] == "7"){
      textArray.push("seven");
    }
    else if (digitsArray[i] == "8"){
      textArray.push("eight");
    }
    else {
      textArray.push("nine");
    }

  }
  console.log(textArray); 
  return textArray;
}

app.post('/settings', function(req, res) {
  console.log("post settings here");
  var questions = req.param('questions', null);
  var specialQuestions = req.param('specialQuestions', null);
  var stringQuestions = req.param('stringQuestions', null);
  models.Account.saveSettings (questions, specialQuestions, stringQuestions );
  res.send(200);
});

//************************ ADD STUDENTS ************************
app.post('/register', function(req, res) {
  var student = req.param('student', null);
  var code = req.param('code', null);
  console.log("PRINT",code, req.session.pic);
    req.session.ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;

  var creationDate = new Date(); 

  if ( code == req.session.pic){
    if ( models.Account.register(student) ){
      console.log("Name: ",student.name.first,"IP ADDRESS: ",req.session.ip, "DATE: ", creationDate);
      res.send(200);
      matching(); 
    }else {
      res.send(401); 
    }
  }
  else {
      res.send(401); 
  }
});

app.get('/addInformation', function(req, res) {
  models.Account.getStudents(function(students){
      if ( req.session.numberOfUsers < students.length ){
        var slicedStudents = students.slice(0, req.session.numberOfUsers ); 
        res.send(slicedStudents);
      }
      else {
        res.send(students);
      }
  }); 
});

app.get('/getMoreStudents', function(req, res) {
  req.session.numberOfUsers += 10; 
  res.send(200); 
}); 


app.delete('/addInformation', function(req, res) {
   var studentId = req.param('studentId', null);
   models.Account.findById(studentId, function (student){
      models.Account.deleteStudents(student); 
   }); 
   console.log("STUDENT REMOVED");
   res.send(200); 
});

//************************ STUDENT ACCOUNT ACTIVATION ************************
app.post('/activation', function(req, res) {
  var id = req.param('studentId', null);
  var activation = req.param('activation', null);
  console.log("STUDENT ACTIVATION");

  models.Account.findById(id, function (studentAccount){
      studentAccount.activation = activation; 
      studentAccount.save(); 
      res.send(200);
  }); 
});

//************************ STUDENT ACCOUNT ACTIVATION ************************
app.get('/match', function(req, res) {
  models.Account.matchStudents(function (){
      res.send(200);
  }); 
});

function matching (){
  models.Account.matchStudents(function (){}); 
}

//************************ STUDENT LOGS ************************

app.get('/logs', function(req, res) {
  models.Account.getLogs (function (data){
    res.send(data[2]);
  } );
});

//************************ STUDENT STATS ************************

app.get('/cnts', function(req, res) {
  models.Account.numStudents (function (students){
    var studentCount = students; 
    console.log(studentCount);
    res.send( {num: studentCount});
  } );
});

app.get('/studentStats', function(req, res) {
  models.Account.getStudents(function(students){
      var statsObject = {
        totalStudents: students.length
      }

      var maleCounter = 0;
      var femaleCounter = 0;
      var seniorCounter = 0;
      var juniorCounter = 0;
      var sophomoreCounter = 0;
      var freshmanCounter = 0;


      for (var i = 0; i < students.length; i++ ){
        var studentSelection = students[i];
        if ( studentSelection.gender == "1" )
          maleCounter++;
        else  
          femaleCounter++;

        if (studentSelection.grade == "Freshman")
          freshmanCounter++;
        else if (studentSelection.grade == "Sophomore")
          sophomoreCounter++;
        else if (studentSelection.grade == "Junior")
          juniorCounter++;
        else 
          seniorCounter++;
      }
      statsObject.males = maleCounter; 
      statsObject.females = femaleCounter; 

      statsObject.freshman = freshmanCounter; 
      statsObject.sophomore = sophomoreCounter; 
      statsObject.junior = juniorCounter; 
      statsObject.senior = seniorCounter; 

      res.send(statsObject);
  }); 
});

//************************ STUDENT SEARCH ************************
app.post('/search', function(req, res) {
  var SearchData = req.param('searchData', null);

  if ( null == SearchData ) {
    res.send(400);
    return;
  }

  models.Account.findMatch(SearchData, function(err, accounts) {
    if (err || accounts.length == 0) {
      console.log(err);
      res.send(404);
    } else {
      res.send(accounts);
    }


  });

});


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
