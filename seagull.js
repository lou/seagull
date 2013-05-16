Quintus.Random = function(Q) {
  Q.random = function(min,max) {
    return Math.ceil(min + Math.random() * (max - min));
  }
};

// Now set up your game (most games will load a separate .js file)
var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch, UI, Random")
        .setup({ maximize: true})
        .controls()
        .touch();


Q.Sprite.extend("Shadow", { 
  init: function(p) {
    this._super(p, {
      color: "rgba(0,0,0,0)",
      y: 410,
      w: 30,
      h: 1
    });
  },
  draw: function(ctx) {
    ctx.fillStyle = this.p.color;
    // Draw a filled rectangle centered at
    // 0,0 (i.e. from -w/2,-h2 to w/2, h/2
    ctx.fillRect(-this.p.cx,
                 -this.p.cy,
                 this.p.w,
                 this.p.h);

  }
});

Q.Sprite.extend("Seagull", { 
  init: function(p) {
    this._super(p, {
      asset: 'seagull.png',
      x: 0,
      y: 0,
      z: 10,
      state: 'glyding',
      gravity: 0.3,
      toughness: 10000
    });
    this.add('2d');

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
    } 
  },

  updateShadow: function(){
    var shadow = Q.stage().lists.Shadow[0];
    var shadowDistance = shadow.p.y - this.p.y;

    shadow.p.x = this.p.x - 10;

    if ( shadowDistance <= 350 ){
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
      Q.stageScene("endGame", 1, { label: "You lose exhausted !" }); 
      this.destroy();
    }
    var toughness = Math.ceil(this.p.toughness / 100);

    $('#toughness').find('.bar').css({ width: toughness+'%' })
  },

  fly: function(){
     this.p.vy = -200;
     this.p.vx = 400;
     this.p.toughness -= 5;
  },

  glide: function(){
    this.p.vx = 400;
    this.p.toughness -= 1;
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
      y: 220,
      points: [[0,0],[20, 300]]
    });
  }
});

Q.Sprite.extend('Boat', {
  init: function(p) {

    this._super(p, {
      asset: 'boat.png',
      x: 1000,
      y: 300,
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
        Q.stage().insert(new Q.Boat({ x: seagull.p.x + 800, speed: Q.random(0, 3)}));
      }, Q.random(0, 5000));
    }
  }
});

Q.scene("level1",function(stage) {
  if ($('#infos').length === 0){
    var infos = $('<div></div>', { id: 'infos' })
    var toughnessBar = $('<div id="toughness"><div class="bar" style="width: 100%"></div></div>')
    var distance = $('<div id="distance"></div>')

    infos.append(toughnessBar)
          .append(distance);
          $('#quintus').after(infos);
  }
  var lighthouse = stage.insert(new Q.Lighthouse());
  var seagull = stage.insert(new Q.Seagull());
  var shadow = stage.insert(new Q.Shadow());

  stage.add("viewport").follow(seagull);

  stage.insert(new Q.Boat({ x: seagull.p.x + 1000 }))
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

Q.load("seagull.png, boat.png, lighthouse.png", function() {
  Q.stageScene("level1");
});

// Q.el.addEventListener('touchstart',function(e) {
//   console.log('fly !!!')
// });

Q.el.addEventListener('mousedown',function(e) {
  var seagull = Q.stage().lists.Seagull[0];

  if (seagull){
    seagull.p.state = 'flying';
  }
});

Q.el.addEventListener('mouseup',function(e) {
  var seagull = Q.stage().lists.Seagull[0];

  if (seagull){
    seagull.p.state = 'glyding';
  }
});