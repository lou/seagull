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