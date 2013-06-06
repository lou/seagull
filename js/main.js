// TODO
// - Shadow should be a seagull component
// - add more sprites(clouds ....)
// - Only one boat should be visible

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

require(['models/seagull', 'models/boat', 'models/lighthouse', 'models/fish'], function(util) {

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
    stage.viewport.offsetY = 500;

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
});

