  Q.Sprite.extend('Lighthouse', {
    init: function(p) {
      this._super(p, {
        asset: 'lighthouse.png',
        x: 15,
        y: Q.stage().seaLevel - 150,
        points: [[0,0],[20, 300]]
      });
    }
  });
