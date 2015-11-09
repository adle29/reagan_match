define(function(require) {
  var Vinbook = Backbone.Model.extend({
  	urlRoot: '/accounts/' + this.accountId + '/vinbook'
  });

  return Vinbook;
});
