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
  serverSocket.onopen = function(e) {
    serverSocket.send('{"message": "connected"}');
  }

  function moveBot(tap) {
    // Compute values for wheels
    var wheels = [];

    wheels[0] =  tap['x'] + tap['y'] + tap['rotation']; // front left
    wheels[1] = -tap['x'] + tap['y'] - tap['rotation']; // front right
    wheels[2] = -tap['x'] + tap['y'] + tap['rotation']; // back left
    wheels[3] =  tap['x'] + tap['y'] - tap['rotation']; // back right

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

    // round all values
    for (var i = 0; i <= 3; i++) {
      wheels[i] = round(wheels[i], 2);
    }
    
    serverSocket.send(JSON.stringify(wheels));
  }

  $('.move').bind('touchstart', function(e) {
    // Check for correctly opened WebSocket
    if (serverSocket.readyState == 0) {
      alert('Sorry, something went wrong.');
      return;
    }

    $(this).addClass('active');
  });

  $('.move').bind('touchend', function(e) {
    $(this).removeClass('active');
  });

  $('#main').bind('touchstart touchmove', function(e) {
    //Disable scrolling by preventing default touch behaviour
    e.preventDefault();
    var orig = e.originalEvent;

    var direction = {};

    for (var i = 0; i < orig.touches.length; i++) {
      var element = $(orig.touches[i].target);

      var topLeft = element.position();
      var width = element.width();
      var height = element.height();
      var paddingX = 80;
      var paddingY = 150;

      var center = {x: topLeft['left'] + (width / 2), y: topLeft['top'] + (height / 2)};
      var tap = {x: orig.touches[i].pageX, y: orig.touches[i].pageY};

      /*****/
      /* X */
      /*****/
      if (tap['x'] > (center['x'] + (width / 2) - paddingX)) {
        tap['x'] = (center['x'] + (width / 2) - paddingX);
      }
      else if (tap['x'] < (center['x'] - (width / 2) + paddingX)) {
        tap['x'] = (center['x'] - (width / 2) + paddingX);
      }

      /*****/
      /* Y */
      /*****/
      if (tap['y'] > (center['y'] + (height / 2) - paddingY)) {
        tap['y'] = (center['y'] + (height / 2) - paddingY);
      }
      else if (tap['y'] < (center['y'] - (height / 2) + paddingY)) {
        tap['y'] = (center['y'] - (height / 2) + paddingY);
      }

      /*********/
      /* remap */
      /*********/
      tap['x'] = remap(tap['x'], (center['x'] - (width / 2) + paddingX), (center['x'] + (width / 2) - paddingX), -1, 1);
      tap['y'] = remap(tap['y'], (center['y'] - (height / 2) + paddingY), (center['y'] + (height / 2) - paddingY), 1, -1);

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
