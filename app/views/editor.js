import Ember from 'ember';

var ROWS = 10.0,
    COLS = 10.0;

export default Ember.View.extend({
  tagName: 'canvas',
  attributeBindings: ['width', 'height'],

  pixels: null,
  width: 400,
  height: 400,
  currentX: null,
  currentY: null,
  painting: false,

  sx: function() {
    return this.get('width') / COLS;
  }.property('width'),

  sy: function() {
    return this.get('height') / COLS;
  }.property('height'),

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

  mouseDown: function() {
    this.set('painting', true);
    this._paint();
  },

  mouseUp: function() {
    this.set('painting', false);
  },

  _paint: function() {
    var pixels = this.get('pixels');
    pixels[this.get('currentY')][this.get('currentX')] = 1;
    this._rerender();
  },

  _rerenderTrigger: function() {
    this._rerender();
  }.observes('currentX', 'currentY'),

  mouseMove: function(e) {
    var canvas = e.target;

    this.setProperties({
      currentX: Math.floor((e.pageX - canvas.offsetLeft) / this.get('sx')),
      currentY: Math.floor((e.pageY - canvas.offsetTop) / this.get('sy')),
    });

    if (this.get('painting')) {
      this._paint();
    }
  },

  _inserted: function() {
    this._canvas = this.$()[0];
    this._ctx = this._canvas.getContext('2d');
    this._rerender();
  }.on('didInsertElement'),

  _rerender: function() {
    Ember.run.once(this, '_render');
  },

  _render: function() {
    var ctx = this._ctx;
    if (!ctx) { return; }

    ctx.fillStyle="#fff";
    ctx.fillRect(0, 0, this.get('width'), this.get('height'));
    ctx.fill();

    var sx = this.get('sx'),
        sy = this.get('sy'),
        pixels = this.get('pixels');

    ctx.fillStyle="#ff0000";
    for (var j=0; j<ROWS; j++) {
      for (var i=0; i<COLS; i++) {
        if (pixels[j][i]) {
          var x = i * sx,
              y = j * sy;
          ctx.fillRect(x-0.5, y-0.5, sx+0.5, sy+0.5);
          ctx.fill();
        }
      }
    }

    // Show current pixel
    ctx.strokeStyle="rgba(0, 0, 0, 0.5)";
    var cx = (this.get('currentX') * sx),
        cy = (this.get('currentY') * sy);
    ctx.strokeRect(cx-0.5, cy-0.5, sx+0.5, sy+0.5);
  }

});
