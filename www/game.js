var SPRITES = {
  PALM_TREE:              { x:    5, y:    5, w:  215, h:  540 },
  BILLBOARD08:            { x:  230, y:    5, w:  385, h:  265 },
  TREE1:                  { x:  625, y:    5, w:  360, h:  360 },
  DEAD_TREE1:             { x:    5, y:  555, w:  135, h:  332 },
  BILLBOARD09:            { x:  150, y:  555, w:  328, h:  282 },
  BOULDER3:               { x:  230, y:  280, w:  320, h:  220 },
  COLUMN:                 { x:  995, y:    5, w:  200, h:  315 },
  BILLBOARD01:            { x:  625, y:  375, w:  300, h:  170 },
  BILLBOARD06:            { x:  488, y:  555, w:  298, h:  190 },
  BILLBOARD05:            { x:    5, y:  897, w:  298, h:  190 },
  BILLBOARD07:            { x:  313, y:  897, w:  298, h:  190 },
  BOULDER2:               { x:  621, y:  897, w:  298, h:  140 },
  TREE2:                  { x: 1205, y:    5, w:  282, h:  295 },
  BILLBOARD04:            { x: 1205, y:  310, w:  268, h:  170 },
  DEAD_TREE2:             { x: 1205, y:  490, w:  150, h:  260 },
  BOULDER1:               { x: 1205, y:  760, w:  168, h:  248 },
  BUSH1:                  { x:    5, y: 1097, w:  240, h:  155 },
  CACTUS:                 { x:  929, y:  897, w:  235, h:  118 },
  BUSH2:                  { x:  255, y: 1097, w:  232, h:  152 },
  BILLBOARD03:            { x:    5, y: 1262, w:  230, h:  220 },
  BILLBOARD02:            { x:  245, y: 1262, w:  215, h:  220 },
  STUMP:                  { x:  995, y:  330, w:  195, h:  140 },
  SEMI:                   { x: 1365, y:  490, w:  122, h:  144 },
  TRUCK:                  { x: 1365, y:  644, w:  100, h:   78 },
  CAR03:                  { x: 1383, y:  760, w:   88, h:   55 },
  CAR02:                  { x: 1383, y:  825, w:   80, h:   59 },
  CAR04:                  { x: 1383, y:  894, w:   80, h:   57 },
  CAR01:                  { x: 1205, y: 1018, w:   80, h:   56 },
  PLAYER_UPHILL_LEFT:     { x: 1383, y:  961, w:   80, h:   45 },
  PLAYER_UPHILL_STRAIGHT: { x: 1295, y: 1018, w:   80, h:   45 },
  PLAYER_UPHILL_RIGHT:    { x: 1385, y: 1018, w:   80, h:   45 },
  PLAYER_LEFT:            { x:  995, y:  480, w:   80, h:   41 },
  PLAYER_STRAIGHT:        { x: 1085, y:  480, w:   80, h:   41 },
  PLAYER_RIGHT:           { x:  995, y:  531, w:   80, h:   41 }
};


var Dom = {
  get: function(id) {
    return document.getElementById(id);
  },
  on: function(ele, type, fn) {
    Dom.get(ele).addEventListener(type, fn);
  }
};

var Util = {
  timestamp: function() {
    return new Date().getTime();
  },
  randomChoice: function(options) {
    return options[Math.floor(Math.random() * options.length)];
  }
};

var Game = {
  run: function(options) {
    Game.loadImages(options.images, function(images) {
      options.ready(images);
      Game.setKeyListener(options.keys);
      Game.startGameLoop(options);
    });
  },
  
  loadImages: function(names, callback) {
    var result = [];
    var count = names.length;
    var onload = function() {
      if (--count === 0) callback(result);
    };
    for (var n = 0; n < names.length; n++) {
      var name = names[n];
      result[n] = new Image();
      result[n].addEventListener('load', onload);
      result[n].src = "images/" + name + ".png";
    }
  },
  
  setKeyListener: function(keys) {
    var onkey = function(ev, mode) {
      keys.forEach(function(k) {
        if (k.key === ev.keyCode) k.action(mode);
      });
    };
    document.addEventListener('keydown', function(ev) {
      onkey(ev, 'down');
    });
    document.addEventListener('keyup', function(ev) {
      onkey(ev, 'up');
    });
  },
  
  startGameLoop: function(options) {
    var lastTime = Util.timestamp();
    function frame() {
      var now = Util.timestamp();
      var dt = (now - lastTime) / 1000.0;
      options.update(dt);
      options.render();
      lastTime = now;
      requestAnimationFrame(frame);
    }
    frame();
  }
};

var Render = {
  sprite: function(ctx, img, sprite, dx, dy, dw, dh) {
    ctx.drawImage(img, sprite.x, sprite.y, sprite.w, sprite.h, dx, dy, dw, dh);
  }
};

// Example usage in a version file like v1.straight.html
document.addEventListener('DOMContentLoaded', function() {
  var canvas = Dom.get('canvas');
  var ctx = canvas.getContext('2d');
  
  Game.run({
    images: ['spritesheet'],
    ready: function(images) {
      var spriteSheet = images[0];
      Render.sprite(ctx, spriteSheet, SPRITES.TREE1, 100, 100, SPRITES.TREE1.w, SPRITES.TREE1.h);
    },
    keys: [
      { key: 37, action: function() { console.log('Left key pressed'); } },
      { key: 39, action: function() { console.log('Right key pressed'); } }
    ],
    update: function(dt) {
      // Update game state
    },
    render: function() {
      // Render game state
    }
  });
});
