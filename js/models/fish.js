Q.Sprite.extend('Fish', {
  init: function(p) {

    this._super(p, {
      asset: 'fish.png',
      x: 1000,
      y: Q.stage().seaLevel + 40,
      vx: -100,
      gravity: 0
    });
    this.add('2d');
  },
  step: function(dt){
    // this.p.x -= this.p.speed;
    var seagull = Q.stage().lists.Seagull[0];

    // destroy the boat if it has disappeared from the screen
    if (seagull && this.p.x - seagull.p.x <= -1000) {
      this.destroy();
      setTimeout(function(){
        Q.stage().insert(new Q.Fish({ x: seagull.p.x + Q.el.width, vx: Q.random(-100, 0)}));
      }, Q.random(0, 3000));
    }
  }
});