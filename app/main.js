$(document).ready(function() {
  // WebSocket
  var serverSocket = new WebSocket('ws://10.32.99.1:8000/');
  serverSocket.onopen = function(event) {
    serverSocket.send('connected');
  }

  // Add event manager for gyro
  window.addEventListener('deviceorientation', function(e) {
    serverSocket.send(e.alpha + ', ' + e.beta + ', ' + e.gamma);
  });

  // Add event manager for arrow keys (on desktop or laptop)
  window.onkeydown = function(event) {
    e = event || window.event;
    var message;

    if (e.keyCode == '38') {
      message = 'FORWARD';
    }
    else if (e.keyCode == '40') {
      message = 'BACKWARD';
    }
    else if (e.keyCode == '37') {
      message = 'LEFT';
    }
    else if (e.keyCode == '39') {
      message = 'RIGHT';
    }

    serverSocket.send(message);
  }

  // Hide intro when 'done' is clicked
  $('.calibrate-button').click(function(e) {
    $('#intro').hide();
    $('#main').show();
  });
});
