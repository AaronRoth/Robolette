// Copyright (c) 2012 Aaron Roth
// See the file license.txt for copying permission.
//
// This code is based on and at times copied verbatim from a tutorial 
// written by Charlie Key. His tutorial is hosted on www.switchonthecode.com
// and is titled "Creating a Roulette Wheel Using HTML5 Canvas."
//

// ------------------ Globals ------------------ //

// Canvas.
var canvasX = 200;
var canvasY = 200;

// Wheel positioning.
var arc = Math.PI / 18.5;
var context;
var insideRadius = 125;
var outsideRadius = 150;
var startAngle = 1.5 * Math.PI;
var textRadius = 132;

// Wheel style and content.
var black = '#000000';
var fontStyle = 'bold 15px sans-serif';
var green = '#006600';
var lineWidth = 2;
var red = '#ff0000';
var white = '#ffffff';
var numbers = ['0', '32', '15', '19', '4', '21', '2', '25', '17', '34', '6',
               '27', '13', '36', '11', '30', '8', '23', '10', '5', '24', '16',
               '33', '1', '20', '14', '31', '9', '22', '18', '29', '7', '28',
               '12', '35', '3', '26'];

// Wheel spinning.
var spinAngle = 0;
var spinAngleStart = 0;
var spinTime = 0;
var spinTimeout = null;
var spinTimeTotal = 0;

// --------------------------------------------- //

$(document).ready(function() {
  $('#start-button').click(initialize_game);
  
  // Make team 1 the current player.
  $('#team1-chips').click(function() {
    if (gameState['state']['undo'] == 1) {
      if (gameState['state']['player'] == 'team2') {
        $('#team2-undo-flag').remove();
        gameState['state']['undo'] = 0;
      }
    }
    
    gameState['state']['player'] = 'team1';
  });
  
  // Make team 2 the current player.
  $('#team2-chips').click(function() {
    if (gameState['state']['undo'] == 1) {
      if (gameState['state']['player'] == 'team1') {
        $('#team1-undo-flag').remove();
        gameState['state']['undo'] = 0;
      }
    }
    
    gameState['state']['player'] = 'team2';
  });
  
  // Make or undo bets.
  $('#game-board').click(function(event) {
    if (gameState['state']['changes'] == 1) {
      update_board_model(event.target);
    } else {
      alert('Cannot make or undo bets right now!');
    }
  });
  
  // Spin the roulette wheel.
  $('#spin-button').live('click', function() {
    spin();
  });
  
  // Turn on undo a bet mode.
  $('#undo').live('click', function() {
    undo();
  });
  
  // Turn off undo a bet mode from player 1.
  $('#team1-undo-flag').live('click', function() {
    gameState['state']['undo'] = 0;
    $(this).remove();
  });
  
  // Turn off undo a bet mode from player 2.
  $('#team2-undo-flag').live('click', function() {
    gameState['state']['undo'] = 0;
    $(this).remove();
  });
  
  // Reset the entire game.
  $('#reset').live('click', function() {
    window.location.reload();
  });

  // freeze_board function
  
  // determine outcome function
      // update wheel color and wheel number in model (basically update winning color and number)
      // visit all winning bet locations
          // if totals for team1 >= min bet
              // drinks["team2"] += number of bets by team1 on that bet
          // if totals for team2 >= min bet
              // drinks["team1"] += number of bets by team2 on that bet
      // update scoreboard
      // send drink counts for each team to database
      // reset all temporary values in the model
          // bets
          // totals
          // drinks
          // wheel
          // state
      // call update view function
});

function determine_outcome(winningBet) {
  alert('Determines outcome for the winning bet: ' + winningBet + '. Still needs defining.');
}

function draw_wheel() {
  var canvas = document.getElementById('wheel');
  
  // Make sure the browser supports canvas.
  if (canvas.getContext) {
    context = canvas.getContext('2d');
    context.clearRect(0, 0, 500, 500);
    
    // Set wheel styles.
    context.strokeStyle = black;
    context.lineWidth = lineWidth;
    context.font = fontStyle;
    
    // Draw entire wheel.
    for (var i = 0; i < 37; i++) {
      var angle = startAngle + i * arc;
      
      // Set colors.
      if (i == 0) {
        context.fillStyle = green;
      } else if (i % 2 != 0) {
        context.fillStyle = red;
      } else {
        context.fillStyle = black;
      }
      
      // Draw wheel.
      context.beginPath();
      context.arc(canvasX, canvasY, outsideRadius, angle, angle + arc, false);
      context.arc(canvasX, canvasY, insideRadius, angle + arc, angle, true);
      context.stroke();
      context.fill();
      context.save();
      
      // Draw numbers on the wheel.
      var text = numbers[i];
      var transX = canvasX + Math.cos(angle + arc / 2) * textRadius;
      var transY = canvasY + Math.sin(angle + arc / 2) * textRadius;
      var rotateVal = angle + arc / 2 + Math.PI / 2;
      
      context.translate(transX, transY);
      context.rotate(rotateVal);
      context.fillStyle = white;
      context.fillText(text, -context.measureText(text).width / 2, 0);
      context.restore();
    }
    
    // Draw arrow.
    context.fillStyle = white;
    context.beginPath();
    context.moveTo(200 - 0, 200 - (outsideRadius + 5));
    context.lineTo(200 + 0, 200 - (outsideRadius + 5));
    context.lineTo(200 + 0, 200 - (outsideRadius - 5));
    context.lineTo(200 + 9, 200 - (outsideRadius - 5));
    context.lineTo(200 + 0, 200 - (outsideRadius - 13));
    context.lineTo(200 - 9, 200 - (outsideRadius - 5));
    context.lineTo(200 - 0, 200 - (outsideRadius - 5));
    context.lineTo(200 - 0, 200 - (outsideRadius + 5));
    context.fill();
  } else {
    alert('Your browser does not support this game! ' +
          'Try Safari, Chrome, Firefox, or Opera.');
  }
}

function ease_out(t, b, c, d) {
  var ts = (t /= d) * t;
  var tc = ts * t;
  
  return b + c * (tc + -3 * ts + 3 * t);
}

function freeze_board() {
  gameState['state']['changes'] = 0;
  gameState['state']['spins'] = 0;
  
  alert('Freeze board. Still needs defining.');
}

function initialize_game() {
  var startBank = $('#starting-bank').val();
  var minBet = $('#min-bet').val();
  var maxBet = $('#max-bet').val();
  
  gameState['chips']['team1'] = startBank;
  gameState['chips']['team2'] = startBank;
  gameState['min'] = minBet;
  gameState['max'] = maxBet;
  
  $('#num-chips-team1').text(startBank);
  $('#num-chips-team2').text(startBank);
  
  $('#form').fadeOut(100, 'linear', function() {
    $('#form').remove();
  });
  $('#title').fadeOut(100, 'linear', function() {
    $('#title').remove();
  });
  
  $('#game-table').fadeIn(100, 'linear');
  
  draw_wheel();
}

function rotate_wheel() {
  spinTime += 30;
  
  if (spinTime >= spinTimeTotal) {
    stop_wheel();
  } else {
    spinAngle = spinAngleStart -
                ease_out(spinTime, 0, spinAngleStart, spinTimeTotal);
    
    startAngle += spinAngle * Math.PI / 180;
    draw_wheel();
    spinTimeout = setTimeout('rotate_wheel()', 30);
  }
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = (Math.random() * 10 + 2) * 1000;
  rotate_wheel();
}

function stop_wheel() {
  // Stop the wheel and freeze all input.
  clearTimeout(spinTimeout);
  freeze_board();
  
  // Calculate what number the ball landed on.
  var radiansSpun = startAngle - (1.5 * Math.PI);
  var unitsSpun = radiansSpun / arc;
  var number = Math.ceil(unitsSpun % 37);
  if (number == 0) {
    number = 37;
  }
  var index = 37 - number;
  context.save();
  var winningNumber = numbers[index];
  
  // Determine winners and update the view.
  determine_outcome(winningNumber);
  update_view();
}

function undo() {
  if (gameState['state']['undo'] == 0) {
    gameState['state']['undo'] = 1;

    currentPlayer = gameState['state']['player'];

    if (currentPlayer == 'team1') {
      $('#team1-chips').append('<div id=\"team1-undo-flag\">stop undo</div>');
    } else if (currentPlayer == 'team2') {
      $('#team2-chips').append('<div id=\"team2-undo-flag\">stop undo</div>');
    } else {
      alert('No bets have been made.');
    }
  }
}

function update_board_model(clickedObject) {
  var clickedID = clickedObject.id;
  var currentPlayer = gameState['state']['player'];
  var currentPlayerBets = gameState['bets'][clickedID][currentPlayer];
  var maxBet = gameState['max'];
  var totalPlayerBets = gameState['totals'][currentPlayer];
  var totalPlayerChips = gameState['chips'][currentPlayer];
  
  if (currentPlayer == 'none') {
    alert('Please select a player.');
  } else {
    // Add a bet.
    if (gameState['state']['undo'] == 0 && totalPlayerBets < maxBet) {
      if (totalPlayerChips > 0) {
        gameState['bets'][clickedID][currentPlayer] = currentPlayerBets + 1;
        gameState['totals'][currentPlayer] = totalPlayerBets + 1;
        gameState['chips'][currentPlayer] = totalPlayerChips - 1;
      } else {
        alert('No more chips to make the bet.');
      }
    } else if (gameState['state']['undo'] == 1) {
      // Undo a bet.
      if (currentPlayerBets > 0 && totalPlayerBets > 0) {
        gameState['bets'][clickedID][currentPlayer] = currentPlayerBets - 1;
        gameState['totals'][currentPlayer] = totalPlayerBets - 1;
        gameState['chips'][currentPlayer] = totalPlayerChips + 1;
      } else if (totalPlayerBets > 0) {
        alert('No bet to remove on this spot.');
      } else {
        alert('Player has no bets to remove.');
      }
    } else if (totalPlayerBets == maxBet) {
      alert('Maximum number of bets have been made.');
    }
  }
  
  update_view();
}

function update_view() {
  var bets = gameState['bets'];
  
  // Update bets.
  for (var bet in bets) {
    if (bets.hasOwnProperty(bet)) {
      $('#' + bet).empty();
      $('#' + bet).append('<div class="token">' + gameState['bets'][bet]['team1'] + '</div>');
      $('#' + bet).append('<div class="token">' + gameState['bets'][bet]['team2'] + '</div>');
    }
  }
  
  // Update chips.
  $('#num-chips-team1').text(gameState['chips']['team1']);
  $('#num-chips-team2').text(gameState['chips']['team2']);
  
  // Update scores.
  $('#team1-score').text(gameState['scores']['team1']);
  $('#team2-score').text(gameState['scores']['team2']);
}