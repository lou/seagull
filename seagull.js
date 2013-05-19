// TODO
// - Shadow should be a seagull component
// - fix crash when seagull hit the water
// - add background and related sprites(water, clouds ....)

Quintus.Random = function(Q) {
  Q.random = function(min,max) {
    return Math.ceil(min + Math.random() * (max - min));
  }
};

Quintus.Data = function(Q) {
  Q.assets['sprites.json'] = {
    "seagull": { "sx": 0, "sy": 0, "cols": 1, "tilew": 80, "tileh": 100, "frames": 9 }
  }
}

var Q = Quintus()
        .include("Sprites, Anim, Scenes, Input, 2D, Touch, UI, Random, Data")
        .setup({ maximize: true})
        .controls(false)
        .touch();

Q.animations('seagull', {
  glide: { frames: [0, 7], rate: 1 },
  fly: { frames: [0,1,2,3,4,5,6,7,8], rate: 1/15, loop: true}
});

Q.Sprite.extend("Shadow", {
  init: function(p) {
    this._super(p, {
      color: "rgba(0,0,0,0)",
      y: Q.stage().seaLevel,
      w: 30,
      h: 1
    });
  },
  draw: function(ctx) {
    ctx.fillStyle = this.p.color;
    ctx.fillRect(-this.p.cx,
                 -this.p.cy,
                 this.p.w,
                 this.p.h);

  }
});

Q.Sprite.extend("Seagull", { 
  init: function(p) {
    this._super(p, {
      sprite: "seagull",
      sheet: "seagull",
      x: 0,
      y: Q.stage().seaLevel - 300,
      z: 10,
      vx: 400,
      state: 'glyding',
      gravity: 0.1,
      toughness: 1000,
      points: [[-30, 0], [0, 20], [30, 0]]
    });
    this.add('2d, animation');
    this.on("hit.sprite", function(collision) {
      if (collision.obj.isA('Boat')){
        this.crash('You crashed on a boat !');
      } else if (collision.obj.isA('Shadow')){
        this.crash('You crashed in water')
      }
    });
  },
  step: function(dt){
    this.updateToughness();
    this.updateDistance();
    this.updateShadow();

    switch(this.p.state){
      case 'flying':
        this.fly();
        break;
      case 'glyding':
        this.glide();
        break;
      case 'crashed':
        this.crash();
        break;
      case 'exhausted':
        this.glide();
        break;
    } 
  },

  updateShadow: function(){
    var shadow = Q.stage().lists.Shadow[0];
    var shadowDistance = shadow.p.y - this.p.y;

    shadow.p.x = this.p.x - 10;

    if ( shadowDistance <= 300 ){
      shadow.p.color = "rgba(0,0,0,1)";
    } else {
      shadow.p.color = "rgba(0,0,0,0)";
    }
  },

  updateDistance: function(){
    var distance = Math.ceil(this.p.x / 20);
    $('#distance').html(distance+' m');
  },

  updateToughness: function(){
    if (this.p.toughness <= 0){
      this.p.state = 'exhausted';
    }
    var toughness = Math.ceil(this.p.toughness / 10);

    $('#toughness').find('.bar').css({ width: toughness+'%' })
  },

  fly: function(){
    this.play('fly');
    this.p.toughness -= 2;

    if (this.p.vy > -100){
      this.p.vy -= 5;
    }

  },

  glide: function(){
    this.play('glide');
  },

  crash: function(text){
    Q.stageScene("endGame", 1, { label: text }); 
    this.destroy();
  }
});

Q.Sprite.extend('Lighthouse', {
  init: function(p) {
    this._super(p, {
      asset: 'lighthouse.png',
      x: 0,
      y: Q.stage().seaLevel - 120,
      points: [[0,0],[20, 300]]
    });
  }
});

Q.Sprite.extend('Boat', {
  init: function(p) {

    this._super(p, {
      asset: 'boat.png',
      x: 1000,
      y: Q.stage().seaLevel - 110,
      points: [[-50, -124], [-100, 126]],
      speed: 2
    });
  },
  step: function(dt){
    this.p.x -= this.p.speed;
    var seagull = Q.stage().lists.Seagull[0];

    // destroy the boat if it has disappeared from the screen
    if (seagull && this.p.x - seagull.p.x <= -1000) {
      this.destroy();
      setTimeout(function(){
        Q.stage().insert(new Q.Boat({ x: seagull.p.x + Q.el.width, speed: Q.random(0, 3)}));
      }, Q.random(0, 5000));
    }
  }
});

Q.Sprite.extend('Fish', {
  init: function(p) {

    this._super(p, {
      asset: 'fish.png',
      x: 1000,
      y: Q.stage().seaLevel + 60,
      speed: 1
    });
  },
  step: function(dt){
    this.p.x -= this.p.speed;
    var seagull = Q.stage().lists.Seagull[0];

    // destroy the boat if it has disappeared from the screen
    if (seagull && this.p.x - seagull.p.x <= -1000) {
      this.destroy();
      setTimeout(function(){
        Q.stage().insert(new Q.Fish({ x: seagull.p.x + Q.el.width, speed: Q.random(0, 3)}));
      }, Q.random(0, 5000));
    }
  }
});



Q.scene("level1", function(stage) {
  if ($('#infos').length === 0){
    var infos = $('<div></div>', { id: 'infos' })
    var toughnessBar = $('<div id="toughness"><div class="bar" style="width: 100%"></div></div>')
    var distance = $('<div id="distance"></div>')

    infos.append(toughnessBar)
          .append(distance);
          $('#quintus').after(infos);
  }
  stage.seaLevel = Q.el.height - Q.el.height / 4;

  var lighthouse = stage.insert(new Q.Lighthouse());
  var seagull = stage.insert(new Q.Seagull());
  var shadow = stage.insert(new Q.Shadow());

  stage.add("viewport").follow(seagull,{ x: true, y: false });
  stage.viewport.offsetX = -(Q.el.width / 2.5);
  // stage.viewport.offsetY = 500;

  stage.insert(new Q.Boat({ x: seagull.p.x + Q.el.width }))
  stage.insert(new Q.Fish({ x: seagull.p.x + Q.el.width * 2 }));
});

Q.scene('endGame',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                           label: "Play Again" }))         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));

  button.on("click",function() {
    Q.clearStages();
    Q.stageScene('level1');
  });
  box.fit(20);
});

Q.load("boat.png, lighthouse.png, sprites.png, fish.png", function() {
  Q.compileSheets("sprites.png", "sprites.json");
  Q.stageScene("level1");
});

Q.el.addEventListener('mousedown',function(e) {
  var seagull = Q.stage().lists.Seagull[0];

  if (seagull && seagull.p.state != 'exhausted'){
    seagull.p.state = 'flying';
  }
});

Q.el.addEventListener('mouseup',function(e) {
  var seagull = Q.stage().lists.Seagull[0];

  if (seagull){
    seagull.p.state = 'glyding';
  }
});


Q.el.addEventListener('touchstart',function(e) {
  var seagull = Q.stage().lists.Seagull[0];

  if (seagull && seagull.p.state != 'exhausted'){
    seagull.p.state = 'flying';
  }
});

Q.el.addEventListener('touchend',function(e) {
  var seagull = Q.stage().lists.Seagull[0];

  if (seagull){
    seagull.p.state = 'glyding';
  }
});