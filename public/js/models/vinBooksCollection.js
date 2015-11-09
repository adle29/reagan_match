define(['models/Vinbook'], function(Vinbook) {
  var VinbookList = Backbone.Collection.extend({
    model: Vinbook
  });

  return VinbookList;
});
