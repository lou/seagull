Q.Sprite.extend("Seagull", { 
  init: function(p) {
    this._super(p, {
      sprite: "seagull",
      sheet: "seagull",
      x: 0,
      y: Q.stage().seaLevel - 330,
      z: 10,
      vx: 0,
      vy: 0,
      state: 'init',
      gravity: 0,
      toughness: 1000,
      air: 1,
      points: [[-30, 0], [0, 20], [30, 0]]
    });

    this.add('2d, animation');
    this.on("hit.sprite", function(collision) {
      var obj = collision.obj;
      if (obj.isA('Boat')){
        this.crash('You crashed on a boat !');
      } else if (obj.isA('Fish')){
        var seagull = this;
        seagull.eat();
        obj.destroy();
        setTimeout(function(){
          Q.stage().insert(new Q.Fish({ x: seagull.p.x + Q.el.width, speed: Q.random(0, 2)}));
        }, Q.random(0, 3000));
      }
    });
  },
  step: function(dt){
    this.updateToughness();
    this.updateDistance();
    this.updateShadow();

    var seagullAltitude = this.p.y + 10;

    if (seagullAltitude >= Q.stage().seaLevel){
      this.p.air -= 0.1;
      console.log(this.p.air);
      if (this.p.state === 'exhausted'){
        this.crash('You are exhausted !!');
      }
    }

    var stage = Q.stage();
    if (seagullAltitude >= stage.seaLevel){
      this.dive();
    }


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
        // FIXME: Possible bug when seagull was not flying
        this.glide();
        break;
    } 
  },

  updateShadow: function(){
    var shadow = Q.stage().lists.Shadow[0];
    var shadowDistance = shadow.p.y - this.p.y;

    shadow.p.x = this.p.x - 10;

    if ( shadowDistance <= 200 && shadowDistance >= 10){
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
    // Flying under the sea
    if (this.p.y + 10 >= Q.stage().seaLevel){
      this.p.vy -= 100;
      this.p.vx = 100;
      console.log('under the sea !!!');
    }
    else {
      console.log('Flying in the sky !!!');
      this.p.vx = 300;
      this.p.air = 100;    
      if (this.p.vy > -100){
        this.p.vy -= 10;
      }
    }
    this.p.toughness -= 1.5;

  },

  glide: function(){
    this.play('glide');
  },

  dive: function(){
    this.p.toughness -= 1;
    this.p.vy = 30;
    this.p.vx = 50;
  },

  eat: function(){
    this.p.toughness = this.p.toughness + 250 < 1000 ? this.p.toughness + 250 : 1000;
  },

  crash: function(text){
    Q.stageScene("endGame", 1, { label: text }); 
    this.destroy();
  }
});

Q.animations('seagull', {
  glide: { frames: [0, 7], rate: 1 },
  fly: { frames: [0,1,2,3,4,5,6,7,8], rate: 1/15 }
});

Q.Sprite.extend("Shadow", {
  init: function(p) {
    this._super(p, {
      color: "rgba(0,0,0,0)",
      y: Q.stage().seaLevel,
      w: 30,
      h: 1,
      type: Q.SPRITEDEFAULT
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
