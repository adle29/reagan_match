define([],
//here
  function(Account ) {
  
  var SocialRouter = Backbone.Router.extend({
    currentView: null,

    routes: {
      "about": "about", 
      "addInformation": "addInformation", 
      "register":"register", 
      "login": "login",
      "profile": "profile",
      "viewInformation": "viewInformation", 
      "memberslogin": "membersLogin", 
      "membersLogin": "membersLogin", 
      "settings": "settings",
      "thanks": "thanks", 
      "profile/:id": "profile", 
      "stats": "stats", 
      "": "defaultRoute"
    },

    about: function() {
      this.changeView('about');
    },

    changeView: function(view, model, id) {
      var that  =this; 
      if (this.currentView != null) {
        this.currentView.undelegateEvents();
      }

      require(['views/' + view], function(View) {
        if ( model == null && id == null ){
          that.currentView = new View();
              that.currentView.render(); 
        }
        else if ( model == null && id != null){
          that.currentView = new View({id: id});
              that.currentView.render(); 
        }
        else{
         that.currentView = new View({model:model, id: id});
              that.currentView.render(); 
        }
      }); 
    },


    defaultRoute: function() {
      this.changeView('index'); 
    },

    login: function() {
      this.changeView('login'); 
    },

    index: function() {
      this.changeView('index'); 
    },

    membersLogin: function() {
      this.changeView('membersLogin'); 
    },

    register: function() {
      this.changeView('register'); 
    },

    stats: function (){
      this.changeView('stats'); 
    },

    settings: function (){
      this.changeView('settings');
    },

    thanks: function (){
      this.changeView('thanks');
    },


    profile: function (){
      this.changeView('profile');
    },

    viewInformation: function() {
      this.changeView('viewInformation'); 
    }

  });

  return new SocialRouter();
});