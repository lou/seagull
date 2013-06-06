// TODO: refactor events, it's actually the same methods for touch and click

Q.el.addEventListener('mousedown',function(e) {
  var seagull = Q.stage().lists.Seagull[0];

  if (seagull){
    if (seagull.p.state = 'init' ){
      seagull.p.vx = 300;
      seagull.p.gravity = 0.1;
    }
    if (seagull.p.state != 'exhausted'){
      seagull.p.state = 'flying';
    }
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

  if (seagull){
    if (seagull.p.state = 'init' ){
      seagull.p.vx = 300;
      seagull.p.gravity = 0.1;
    }
    if (seagull.p.state != 'exhausted'){
      seagull.p.state = 'flying';
    }
  }
});

Q.el.addEventListener('touchend',function(e) {
  var seagull = Q.stage().lists.Seagull[0];

  if (seagull){
    seagull.p.state = 'glyding';
  }
});