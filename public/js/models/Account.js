define(['models/vinBooksCollection'], function(VinBooksCollection) {
  var Account = Backbone.Model.extend({
    urlRoot: '/accounts',

    initialize: function() {
       this.vinbooks       = new VinBooksCollection();
       this.vinbooks.url   = '/accounts/' + this.id + '/vinbook';

    }
  });

  return Account;
});
