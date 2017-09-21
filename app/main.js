// Helper functions
function between(x, min, max) {
  return x >= min && x <= max;
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

$(document).ready(function() {
  // WebSocket
  var serverSocket = new WebSocket('ws://3299vision.local:8000/');
  serverSocket.onopen = function(event) {
    serverSocket.send('connected');
  }


  // Add event manager for gyro
  window.addEventListener('deviceorientation', function(e) {
    // Alpha -> Rotation
    // Beta  -> x-direction
    // Gamma -> y-direction
    var rotation = round(e.alpha, 2);
    var xDirection = round(e.beta, 2);
    var yDirection = round(e.gamma, 2);

    // Alpha limited to 180 degrees
    if (between(rotation, 0, 90)) { rotation = -rotation; }
    else if (between(rotation, 270, 360)) { rotation = 360 - rotation; }
    else if (between(rotation, 90, 180)) { rotation = -90; }
    else if (between(rotation, 180, 270)) { rotation = 90; }

    // Beta limited to 180 degrees
    if (between(xDirection, -180, -90)) { xDirection = -90}
    if (between(xDirection, 90, 180)) { xDirection = 90}

    // Gamma limited to ± 25 degrees (so screen doesn't rotate)
    if (between(yDirection, 25, 90)) { yDirection = 25; }
    else if (between(yDirection, -90, -25)) { yDirection = -25; }

    serverSocket.send(yDirection);
  });

  // Hide intro when 'done' is clicked
  $('.calibrate-button').click(function(e) {
    $('#intro').hide();
    $('#main').show();
  });
});
