import Ember from 'ember';

var Router = Ember.Router.extend({
  location: PixelENV.locationType
});

Router.map(function() {
  this.resource('paint');
});

export default Router;
