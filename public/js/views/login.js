define(['AdaptiveMindView','text!templates/login.html'], function(AdaptiveMindView, loginTemplate) {
  var loginView = AdaptiveMindView.extend({
    requireLogin: false,

    el: $('#content'),

    events: {
      "submit form": "login"
    },

    login: function() {

      $.post('/login', {
        email: $('input[name=email]').val(),
        password: $('input[name=password]').val()
      }, 

      function(student) {
        console.log(student);
        if (student.activation){window.location.replace('#profile/'+ student._id );}
        else { window.location.replace('#thanks'); }
      }).error(function(){
        $("#error").text('Unable to login.');
        $("#error").slideDown();
      });

      return false;
    },

    render: function() {
      this.$el.html(loginTemplate);
      $("#error").hide();
    }
  });

  return loginView;
});
