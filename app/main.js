// Helper functions
function between(x, min, max) {
  return x >= min && x <= max;
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function remap(n,i,o,r,t){return i>o?i>n?(n-i)*(t-r)/(o-i)+r:r:o>i?o>n?(n-i)*(t-r)/(o-i)+r:t:void 0}

function radiansToDegrees(angle) {
  return angle * (180/Math.PI);
}

$(document).ready(function() {
  // WebSocket
  var serverSocket = new WebSocket('ws://3299vision.local:8000/');
  serverSocket.onopen = function(event) {
    serverSocket.send('connected');
  }

  function moveBot(tap) {
    // Compute values for wheels
    var wheels = [];

    wheels[0] = round(tap['x'] + tap['y'] + tap['rotation'], 3);  // front left
    wheels[1] = round(-tap['x'] + tap['y'] - tap['rotation'], 3); // front right
    wheels[2] = round(-tap['x'] + tap['y'] + tap['rotation'], 3); // back left
    wheels[3] = round(tap['x'] + tap['y'] - tap['rotation'], 3);  // back right

    // Normalize values
    var maxMagnitude = 0;
    for (var i = 0; i <= 3; i++) {
      if (Math.abs(wheels[i]) > maxMagnitude) {
        maxMagnitude = Math.abs(wheels[i]);
      }
    }

    if (maxMagnitude > 1) {
      for (var i = 0; i <= 3; i++) {
        wheels[i] = wheels[i] / maxMagnitude;
      }
    }
    console.log(wheels)
    //serverSocket.send(wheels['frontLeft']);
  }

  $('#main').bind("touchstart touchmove", function(e) {
    //Disable scrolling by preventing default touch behaviour
    e.preventDefault();
    var orig = e.originalEvent;

    var direction = {};

    for (var i = 0; i < orig.touches.length; i++) {
      var element = $(orig.touches[i].target);

      var topLeft = element.position();
      var width = element.width();
      var height = element.height();
      var padding = 100;

      var center = {x: topLeft['left'] + (width / 2), y: topLeft['top'] + (height / 2)};
      var tap = {x: orig.touches[i].pageX, y: orig.touches[i].pageY};

      /*****/
      /* X */
      /*****/
      if (tap['x'] > (center['x'] + (width / 2) - padding)) {
        tap['x'] = (center['x'] + (width / 2) - padding);
      }
      else if (tap['x'] < (center['x'] - (width / 2) + padding)) {
        tap['x'] = (center['x'] - (width / 2) + padding);
      }

      /*****/
      /* Y */
      /*****/
      if (tap['y'] > (center['y'] + (height / 2) - padding)) {
        tap['y'] = (center['y'] + (height / 2) - padding);
      }
      else if (tap['y'] < (center['y'] - (height / 2) + padding)) {
        tap['y'] = (center['y'] - (height / 2) + padding);
      }

      /*********/
      /* remap */
      /*********/
      tap['x'] = remap(tap['x'], (center['x'] - (width / 2) + padding), (center['x'] + (width / 2) - padding), -1, 1);
      tap['y'] = remap(tap['y'], (center['y'] - (height / 2) + padding), (center['y'] + (height / 2) - padding), 1, -1);

      if (element.attr('id') == 'translation-drive') {
        direction = {x: tap['x'], y: tap['y']};
      }

      if (element.attr('id') == 'rotation-drive') {
        direction['rotation'] = tap['x'];
      }
    }

    if (!direction['x']) {
      direction['x'] = 0;
      direction['y'] = 0;
    }

    if (!direction['rotation']) {
      direction['rotation'] = 0;
    }

    // send coordinates
    moveBot(direction);
  });

  $('#main').bind('touchend', function(e) {
    if (e.originalEvent.touches.length == 0) { // only if no fingers are touching
      moveBot({x: 0, y: 0, rotation: 0}); // stop the bot
    }
  });
});
