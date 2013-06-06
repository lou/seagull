Q.Sprite.extend('Boat', {
  init: function(p) {

    this._super(p, {
      asset: 'boat.png',
      x: 1000,
      y: Q.stage().seaLevel - 110,
      points: [[-50, -124], [-100, 126]],
      vx: -100,
      gravity: 0
    });
    this.add('2d');
  },
  step: function(dt){
    var seagull = Q.stage().lists.Seagull[0];

    // destroy the boat if it has disappeared from the screen
    if (seagull && this.p.x - seagull.p.x <= -1000) {
      this.destroy();
      setTimeout(function(){
        Q.stage().insert(new Q.Boat({ x: seagull.p.x + Q.el.width, vx: Q.random(-100, 0)}));
      }, Q.random(0, 6000));
    }
  }
});