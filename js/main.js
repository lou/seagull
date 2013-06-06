// TODO
// - Shadow should be a seagull component
// - add more sprites(clouds ....)
// - Only one boat should be visible

require([
  'modules/utils',
  'config/sprites',
  'config/quintus',
  'config/quintus',
  'models/seagull', 'models/boat', 'models/lighthouse', 'models/fish',
  'config/events',
  'levels/level1',
  'levels/gameover'
  ], function() {

  Q.load("boat.png, lighthouse.png, sprites.png, fish.png", function() {
    Q.compileSheets("sprites.png", "sprites.json");
    Q.stageScene("level1");
  });

});

