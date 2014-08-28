import Ember from 'ember';

var ROWS = 10.0,
    COLS = 10.0;

export default Ember.View.extend({
  tagName: 'canvas',
  pixels: null,
  width: 400,
  height: 400,
  attributeBindings: ['width', 'height'],

  _init: function() {
    var pixels = [];
    for (var j=0; j<ROWS; j++) {
      pixels[j] = [];
      for (var i=0; i<COLS; i++) {
        pixels[j][i] = 0;
      }
    }
    this.set('pixels', pixels);
  }.on('init'),

  click: function(e) {
    var canvas = e.target,
        x = e.pageX - canvas.offsetLeft,
        y = e.pageY - canvas.offsetTop,
        sx = this.sx,
        sy = this.sy,
        px = Math.floor(x / sx),
        py = Math.floor(y / sy),
        pixels = this.get('pixels');

    pixels[py][px] = 1;
    this._render();
  },

  _inserted: function() {
    this.canvas = this.$()[0];
    this.ctx = this.canvas.getContext('2d');
    this.sx = this.$().width() / COLS;
    this.sy = this.$().height() / ROWS;
    this._render();
  }.on('didInsertElement'),

  _render: function() {
    var ctx = this.ctx;

    ctx.fillStyle="#fff";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fill();

    var sx = this.sx,
        sy = this.sy,
        pixels = this.get('pixels');

    ctx.fillStyle="#ff0000";
    for (var j=0; j<ROWS; j++) {
      for (var i=0; i<COLS; i++) {
        if (pixels[j][i]) {
          var x = i * sx,
              y = j * sy;
          ctx.fillRect(x, y, sx, sy);
          ctx.fill();
        }
      }
    }
  }

});
