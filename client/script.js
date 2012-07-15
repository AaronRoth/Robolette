// Copyright (c) 2012 Aaron Roth
// See the file license.txt for copying permission.
//
// This code is based on and at times copied verbatim from a tutorial 
// written by Charlie Key. His tutorial is hosted on www.switchonthecode.com
// and is titled "Creating a Roulette Wheel Using HTML5 Canvas."
//

// ------------------ Globals ------------------ //

// Canvas.
var canvasX = 187;
var canvasY = 187;

// Wheel positioning.
var arc = Math.PI / 18.5;
var context;
var insideRadius = 125;
var outsideRadius = 150;
var startAngle = 1.5 * Math.PI;
var textRadius = 132;

// Wheel style and content.
var black = '#000000';
var fontStyle = '12pt "Cantata One"';
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

// Other.
var team1 = 'blue';
var team2 = 'yellow';

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
    $('#team2-chips').css('background', '#397564');
    $('#team1-chips').css('background', '#77b3a2');
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
    $('#team1-chips').css('background', '#397564');
    $('#team2-chips').css('background', '#77b3a2');
  });
  
  // Make or undo bets.
  $('#game-board').click(function(event) {
    if (gameState['state']['changes'] == 1) {
      if ($(event.target).hasClass('token')) {
        update_board_model($(event.target).parent());
      } else {
        update_board_model($(event.target));
      }
      
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
  
  // Use hover to indicate bets by lightening background colors.
  $('#bet-straightup-0').hover(
    function() {
      $('#spot-0').css('background-color', '#77b3a2');
    },
    function() {
      $('#spot-0').css('background-color', '#397564');
    }
  );
  
  $('.spacer').hover(
    function() {
      var bet = $(this).attr('id');
      var nums = bet.split('-').slice(2);
      
      if ($(this).hasClass('bet-spacer-column')) {
        if (bet == 'bet-column-1st') {
          for (var i = 1; i <= 34; i += 3) {
            $('#spot-1to34').css('background-color', '#77b3a2');
            
            if ($('#spot-' + i).hasClass('black')) {
              $('#spot-' + i).css('background-color', '#444444');
            } else if ($('#spot-' + i).hasClass('red')) {
              $('#spot-' + i).css('background-color', '#ff6f77');
            }
          }
        } else if (bet == 'bet-column-2nd') {
          for (var i = 2; i <= 35; i += 3) {
            $('#spot-2to35').css('background-color', '#77b3a2');
            
            if ($('#spot-' + i).hasClass('black')) {
              $('#spot-' + i).css('background-color', '#444444');
            } else if ($('#spot-' + i).hasClass('red')) {
              $('#spot-' + i).css('background-color', '#ff6f77');
            }
          }
        } else {
          for (var i = 3; i <= 36; i += 3) {
            $('#spot-3to36').css('background-color', '#77b3a2');
            
            if ($('#spot-' + i).hasClass('black')) {
              $('#spot-' + i).css('background-color', '#444444');
            } else if ($('#spot-' + i).hasClass('red')) {
              $('#spot-' + i).css('background-color', '#ff6f77');
            }
          }
        }
      } else if (bet == 'bet-dozen-1st') {
          for (var i = 1; i <= 12; i++) {
            $('#spot-1st').css('background-color', '#77b3a2');
            
            if ($('#spot-' + i).hasClass('red')) {
              $('#spot-' + i).css('background-color', '#ff6f77');
            } else {
              $('#spot-' + i).css('background-color', '#444444');
            }
          }
      } else if (bet == 'bet-dozen-2nd') {
        for (var i = 13; i <= 24; i++) {
          $('#spot-2nd').css('background-color', '#77b3a2');
          
          if ($('#spot-' + i).hasClass('red')) {
            $('#spot-' + i).css('background-color', '#ff6f77');
          } else {
            $('#spot-' + i).css('background-color', '#444444');
          }
        }
      } else if (bet == 'bet-dozen-3rd') {
        for (var i = 25; i <= 36; i++) {
          $('#spot-3rd').css('background-color', '#77b3a2');
          
          if ($('#spot-' + i).hasClass('red')) {
            $('#spot-' + i).css('background-color', '#ff6f77');
          } else {
            $('#spot-' + i).css('background-color', '#444444');
          }
        }
      } else if (bet == 'bet-half-1to18') {
        for (var i = 1; i <= 18; i++) {
          $('#spot-1to18').css('background-color', '#77b3a2');
          
          if ($('#spot-' + i).hasClass('red')) {
            $('#spot-' + i).css('background-color', '#ff6f77');
          } else {
            $('#spot-' + i).css('background-color', '#444444');
          }
        }
      } else if (bet == 'bet-half-19to36') {
        for (var i = 19; i <= 36; i++) {
          $('#spot-19to36').css('background-color', '#77b3a2');
          
          if ($('#spot-' + i).hasClass('red')) {
            $('#spot-' + i).css('background-color', '#ff6f77');
          } else {
            $('#spot-' + i).css('background-color', '#444444');
          }
        }
      } else if (bet == 'bet-other-even') {
        for (var i = 2; i <= 36; i += 2) {
          $('#spot-even').css('background-color', '#77b3a2');
          
          if ($('#spot-' + i).hasClass('red')) {
            $('#spot-' + i).css('background-color', '#ff6f77');
          } else {
            $('#spot-' + i).css('background-color', '#444444');
          }
        }
      } else if (bet == 'bet-other-odd') {
        for (var i = 1; i <= 35; i += 2) {
          $('#spot-odd').css('background-color', '#77b3a2');
          
          if ($('#spot-' + i).hasClass('red')) {
            $('#spot-' + i).css('background-color', '#ff6f77');
          } else {
            $('#spot-' + i).css('background-color', '#444444');
          }
        }
      } else if (bet == 'bet-other-red') {
        for (var i = 1; i <= 36; i++) {
          $('#spot-red').css('background-color', '#77b3a2');
          
          if ($('#spot-' + i).hasClass('red')) {
            $('#spot-' + i).css('background-color', '#ff6f77');
          }
        }
      } else if (bet == 'bet-other-black') {
        for (var i = 1; i <= 36; i++) {
          $('#spot-black').css('background-color', '#77b3a2');
          
          if ($('#spot-' + i).hasClass('black')) {
            $('#spot-' + i).css('background-color', '#444444');
          }
        }
      } else {
        for (var i = 0; i < nums.length; i++) {
          if ($('#spot-' + nums[i]).hasClass('black')) {
            $('#spot-' + nums[i]).css('background-color', '#444444');
          } else if ($('#spot-' + nums[i]).hasClass('red')) {
            $('#spot-' + nums[i]).css('background-color', '#ff6f77');
          } else if ('#spot-' + nums[i] == '#spot-0') {
            $('#spot-' + nums[i]).css('background-color', '#77b3a2');
          }
        }
      }
    },
    function() {
      var bet = $(this).attr('id');
      var nums = bet.split('-').slice(2);
      
      if ($(this).hasClass('bet-spacer-column')) {
        if (bet == 'bet-column-1st') {
          for (var i = 1; i <= 34; i += 3) {
            $('#spot-1to34').css('background-color', '#397564');
            
            if ($('#spot-' + i).hasClass('black')) {
              $('#spot-' + i).css('background-color', '#000000');
            } else if ($('#spot-' + i).hasClass('red')) {
              $('#spot-' + i).css('background-color', '#ff1a37');
            }
          }
        } else if (bet == 'bet-column-2nd') {
          for (var i = 2; i <= 35; i += 3) {
            $('#spot-2to35').css('background-color', '#397564');
            
            if ($('#spot-' + i).hasClass('black')) {
              $('#spot-' + i).css('background-color', '#000000');
            } else if ($('#spot-' + i).hasClass('red')) {
              $('#spot-' + i).css('background-color', '#ff1a37');
            }
          }
        } else {
          for (var i = 3; i <= 36; i += 3) {
            $('#spot-3to36').css('background-color', '#397564');
            
            if ($('#spot-' + i).hasClass('black')) {
              $('#spot-' + i).css('background-color', '#000000');
            } else if ($('#spot-' + i).hasClass('red')) {
              $('#spot-' + i).css('background-color', '#ff1a37');
            }
          }
        }
      } else if (bet == 'bet-dozen-1st') {
          for (var i = 1; i <= 12; i++) {
            $('#spot-1st').css('background-color', '#397564');
            
            if ($('#spot-' + i).hasClass('red')) {
              $('#spot-' + i).css('background-color', '#ff1a37');
            } else {
              $('#spot-' + i).css('background-color', '#000000');
            }
          }
      } else if (bet == 'bet-dozen-2nd') {
        for (var i = 13; i <= 24; i++) {
          $('#spot-2nd').css('background-color', '#397564');
          
          if ($('#spot-' + i).hasClass('red')) {
            $('#spot-' + i).css('background-color', '#ff1a37');
          } else {
            $('#spot-' + i).css('background-color', '#000000');
          }
        }
      } else if (bet == 'bet-dozen-3rd') {
        for (var i = 25; i <= 36; i++) {
          $('#spot-3rd').css('background-color', '#397564');
          
          if ($('#spot-' + i).hasClass('red')) {
            $('#spot-' + i).css('background-color', '#ff1a37');
          } else {
            $('#spot-' + i).css('background-color', '#000000');
          }
        }
      } else if (bet == 'bet-half-1to18') {
        for (var i = 1; i <= 18; i++) {
          $('#spot-1to18').css('background-color', '#397564');
          
          if ($('#spot-' + i).hasClass('red')) {
            $('#spot-' + i).css('background-color', '#ff1a37');
          } else {
            $('#spot-' + i).css('background-color', '#000000');
          }
        }
      } else if (bet == 'bet-half-19to36') {
        for (var i = 19; i <= 36; i++) {
          $('#spot-19to36').css('background-color', '#397564');
          
          if ($('#spot-' + i).hasClass('red')) {
            $('#spot-' + i).css('background-color', '#ff1a37');
          } else {
            $('#spot-' + i).css('background-color', '#000000');
          }
        }
      } else if (bet == 'bet-other-even') {
        for (var i = 2; i <= 36; i += 2) {
          $('#spot-even').css('background-color', '#397564');

          if ($('#spot-' + i).hasClass('red')) {
            $('#spot-' + i).css('background-color', '#ff1a37');
          } else {
            $('#spot-' + i).css('background-color', '#000000');
          }
        }
      } else if (bet == 'bet-other-odd') {
        for (var i = 1; i <= 35; i += 2) {
          $('#spot-odd').css('background-color', '#397564');
          
          if ($('#spot-' + i).hasClass('red')) {
            $('#spot-' + i).css('background-color', '#ff1a37');
          } else {
            $('#spot-' + i).css('background-color', '#000000');
          }
        }
      } else if (bet == 'bet-other-red') {
        for (var i = 1; i <= 36; i++) {
          $('#spot-red').css('background-color', '#397564');
          
          if ($('#spot-' + i).hasClass('red')) {
            $('#spot-' + i).css('background-color', '#ff1a37');
          }
        }
      } else if (bet == 'bet-other-black') {
        for (var i = 1; i <= 36; i++) {
          $('#spot-black').css('background-color', '#397564');
          
          if ($('#spot-' + i).hasClass('black')) {
            $('#spot-' + i).css('background-color', '#000000');
          }
        }
      } else {
        for (var i = 0; i < nums.length; i++) {
          if ($('#spot-' + nums[i]).hasClass('black')) {
            $('#spot-' + nums[i]).css('background-color', '#000000');
          } else if ($('#spot-' + nums[i]).hasClass('red')) {
            $('#spot-' + nums[i]).css('background-color', '#ff1a37');
          } else if ('#spot-' + nums[i] == '#spot-0') {
            $('#spot-' + nums[i]).css('background-color', '#397564');
          }
        }
      }
    }
  );
  
  // Show the settings menu.
  $('#settings-button').click(function() {
    if ($('#options').css('visibility') == 'hidden') {
      $('#options').css('visibility', 'visible');
      $('#settings-menu').css('background', '#77b3a2');
      
      $('#settings-menu').unbind();
      setTimeout(function() {$(document).bind('click.menu', hide_menu);}, 0);
    } else {
      hide_menu(event);
    }
  });

  // NOT DONE YET!!!!!!!!!!!!!!!!!!!!
  // freeze_board function
  // COMPLETE COMPLETE COMPLETE THIS!
  
});

function determine_outcome(winningNumber) {
  winningBets = determine_winning_bets(parseInt(winningNumber));
  
  $.each(winningBets, function(index, value) {
    var betToCheck = 'bet-' + value;
    var betsTeam1 = gameState['bets'][betToCheck]['team1'];
    var betsTeam2 = gameState['bets'][betToCheck]['team2'];
    
    if (gameState['totals']['team1'] >= gameState['min'] && betsTeam1 > 0) {
      gameState['drinks']['team2'] = gameState['drinks']['team2'] + betsTeam1;
    }
    
    if (gameState['totals']['team2'] >= gameState['min'] && betsTeam2 > 0) {
      gameState['drinks']['team1'] = gameState['drinks']['team1'] + betsTeam2;
    }
  });
  
  // Update view so that the score board will reflect new wins/losses.
  update_view('neither', null);
  
  var drinksT1 = gameState['drinks']['team1'];
  var drinksT2 = gameState['drinks']['team2'];
  
  // Send drink updates to server.
  $.ajax({
    url: 'http://findaaron.nfshost.com/Robolette/php/update_counts.php',
    type: 'GET',
    data: {team_one: drinksT1, team_two: drinksT2}
  });
  
  // -------- Reset temporary values in the model -------- //
  
  var bets = gameState['bets'];
  
  // Reset bet values to zero.
  for (var bet in bets) {
    if (bets.hasOwnProperty(bet)) {
      gameState['bets'][bet]['team1'] = 0;
      gameState['bets'][bet]['team2'] = 0;
    }
  }
  
  // Reset drink values to zero.
  gameState['drinks']['team1'] = 0;
  gameState['drinks']['team2'] = 0;
  
  // Reset bet totals to zero.
  gameState['totals']['team1'] = 0;
  gameState['totals']['team2'] = 0;
  
  // Reset state values.
  gameState['state']['changes'] = 1;
  gameState['state']['player'] = 'none';
  gameState['state']['spins'] = 1;
  gameState['state']['undo'] = 0;
  
  update_view('neither', null);
}

function determine_winning_bets(winningNumber) {
  var winningBets;
  
  switch (winningNumber) {
    case 0:
        winningBets = ['straightup-0', 'split-0-1', 'split-0-2', 'split-0-3',
                       'basket-0-2-3', 'basket-0-1-2', 'corner-0-1-2-3'];
        return winningBets;
    case 1:
      winningBets = ['straightup-1', 'split-0-1', 'split-1-2', 'split-1-4',
                     'street-1-2-3', 'corner-0-1-2-3', 'basket-0-1-2',
                     'corner-1-2-4-5', 'sixline-1-2-3-4-5-6', 'column-1st',
                     'dozen-1st', 'half-1to18', 'other-odd', 'other-red'];
      return winningBets;
    case 2:
      winningBets = ['straightup-2', 'split-0-2', 'split-2-3', 'split-2-5',
                     'split-1-2', 'basket-0-1-2', 'basket-0-2-3',
                     'corner-2-3-5-6', 'corner-1-2-4-5', 'column-2nd',
                     'dozen-1st', 'half-1to18', 'other-even', 'other-black'];
      return winningBets;
    case 3:
      winningBets = ['straightup-3', 'split-0-3', 'split-3-6', 'split-2-3',
                     'basket-0-2-3', 'corner-2-3-5-6', 'column-3rd',
                     'dozen-1st', 'half-1to18', 'other-odd', 'other-red'];
      return winningBets;
    case 4:
      winningBets = ['straightup-4', 'split-1-4', 'split-4-5', 'split-4-7',
                     'street-4-5-6', 'sixline-1-2-3-4-5-6', 'corner-1-2-4-5',
                     'corner-4-5-7-8', 'sixline-4-5-6-7-8-9', 'column-1st',
                     'dozen-1st', 'half-1to18', 'other-even', 'other-black'];
      return winningBets;
    case 5:
      winningBets = ['straightup-5', 'split-2-5', 'split-5-6', 'split-5-8',
                     'split-4-5', 'corner-1-2-4-5', 'corner-2-3-5-6',
                     'corner-5-6-8-9', 'corner-4-5-7-8', 'column-2nd',
                     'dozen-1st', 'half-1to18', 'other-odd', 'other-red'];
      return winningBets;
    case 6:
      winningBets = ['straightup-6', 'split-5-6', 'split-6-9', 'split-5-6',
                     'corner-2-3-5-6', 'corner-5-6-8-9', 'column-3rd',
                     'dozen-1st', 'half-1to18', 'other-even', 'other-black'];
      return winningBets;
    case 7:
      winningBets = ['straightup-7', 'split-4-7', 'split-7-8', 'split-7-10',
                     'street-7-8-9', 'sixline-4-5-6-7-8-9', 'corner-4-5-7-8',
                     'corner-7-8-10-11', 'sixline-7-8-9-10-11-12', 'column-1st',
                     'dozen-1st', 'half-1to18', 'other-odd', 'other-red'];
      return winningBets;
    case 8:
      winningBets = ['straightup-8', 'split-5-8', 'split-8-9', 'split-8-11',
                     'split-7-8', 'corner-4-5-7-8', 'corner-5-6-8-9',
                     'corner-8-9-11-12', 'corner-7-8-10-11', 'column-2nd',
                     'dozen-1st', 'half-1to18', 'other-even', 'other-black'];
      return winningBets;
    case 9:
      winningBets = ['straightup-9', 'split-6-9', 'split-9-12', 'split-8-9',
                     'corner-5-6-8-9', 'corner-8-9-11-12', 'column-3rd',
                     'dozen-1st', 'half-1to18', 'other-odd', 'other-red'];
      return winningBets;
    case 10:
      winningBets = ['straightup-10', 'split-7-10', 'split-10-11',
                     'split-10-13', 'street-10-11-12', 'sixline-7-8-9-10-11-12',
                     'corner-7-8-10-11', 'corner-10-11-13-14',
                     'sixline-10-11-12-13-14-15', 'column-1st',
                     'dozen-1st', 'half-1to18', 'other-even', 'other-black'];
      return winningBets;
    case 11:
      winningBets = ['straightup-11', 'split-8-11', 'split-11-12',
                     'split-11-14', 'split-10-11', 'corner-7-8-10-11',
                     'corner-8-9-11-12', 'corner-11-12-14-15',
                     'corner-10-11-13-14', 'column-2nd',
                     'dozen-1st', 'half-1to18', 'other-odd', 'other-black'];
      return winningBets;
    case 12:
      winningBets = ['straightup-12', 'split-9-12', 'split-12-15',
                     'split-11-12', 'corner-8-9-11-12',
                     'corner-11-12-14-15', 'column-3rd', 'dozen-1st',
                     'half-1to18', 'other-even', 'other-red'];
      return winningBets;
    case 13:
      winningBets = ['straightup-13', 'split-10-13', 'split-13-14',
                     'split-13-16', 'street-13-14-15',
                     'sixline-10-11-12-13-14-15', 'corner-10-11-13-14',
                     'corner-13-14-16-17', 'sixline-13-14-15-16-17-18',
                     'column-1st', 'dozen-2nd', 'half-1to18',
                     'other-odd', 'other-black'];
      return winningBets;
    case 14:
      winningBets = ['straightup-14', 'split-11-12', 'split-14-15',
                     'split-14-17', 'split-13-14', 'corner-10-11-13-14',
                     'corner-11-12-14-15', 'corner-14-15-17-18',
                     'corner-13-14-16-17', 'column-2nd', 'dozen-2nd',
                     'half-1to18', 'other-even', 'other-red'];
      return winningBets;
    case 15:
      winningBets = ['straightup-15', 'split-12-15', 'split-15-18',
                     'split-14-15', 'corner-11-12-14-15',
                     'corner-14-15-17-18', 'column-3rd', 'dozen-2nd',
                     'half-1to18', 'other-odd', 'other-black'];
      return winningBets;
    case 16:
      winningBets = ['straightup-16', 'split-13-16', 'split-16-17',
                     'split-16-19', 'street-16-17-18',
                     'sixline-13-14-15-16-17-18',
                     'corner-13-14-16-17', 'corner-16-17-19-20',
                     'sixline-16-17-18-19-20-21', 'column-1st',
                     'dozen-2nd', 'half-1to18', 'other-even', 'other-red'];
      return winningBets;
    case 17:
      winningBets = ['straightup-17', 'split-14-17', 'split-17-18',
                     'split-17-20', 'split-16-17', 'corner-13-14-16-17',
                     'corner-14-15-17-18', 'corner-17-18-20-21',
                     'corner-16-17-19-20', 'column-2nd', 'dozen-2nd',
                     'half-1to18', 'other-odd', 'other-black'];
      return winningBets;
    case 18:
      winningBets = ['straightup-18', 'split-15-18', 'split-18-21',
                     'split-17-18', 'corner-14-15-17-18',
                     'corner-17-18-20-21', 'column-3rd', 'dozen-2nd',
                     'half-1to18', 'other-even', 'other-red'];
      return winningBets;
    case 19:
      winningBets = ['straightup-19', 'split-16-19', 'split-19-20',
                     'split-19-22', 'street-19-20-21',
                     'sixline-16-17-18-19-20-21', 'corner-16-17-19-20',
                     'corner-19-20-22-23', 'sixline-19-20-21-22-23-24',
                     'column-1st', 'dozen-2nd', 'half-19to36',
                     'other-odd', 'other-red'];
      return winningBets;
    case 20:
      winningBets = ['straightup-20', 'split-17-20', 'split-20-21',
                     'split-20-23', 'split-19-20', 'corner-16-17-19-20',
                     'corner-17-18-20-21', 'corner-20-21-23-24',
                     'corner-19-20-22-23', 'column-2nd', 'dozen-2nd',
                     'half-19to36', 'other-even', 'other-black'];
      return winningBets;
    case 21:
      winningBets = ['straightup-21', 'split-18-21', 'split-21-24',
                     'split-20-21', 'corner-17-18-20-21',
                     'corner-20-21-23-24', 'column-3rd', 'dozen-2nd',
                     'half-19to36', 'other-odd', 'other-red'];
      return winningBets;
    case 22:
      winningBets = ['straightup-22', 'split-19-20', 'split-22-23',
                     'split-22-25', 'street-22-23-24',
                     'sixline-19-20-21-22-23-24', 'corner-19-20-22-23',
                     'corner-22-23-25-26', 'sixline-22-23-24-25-26-27',
                     'column-1st', 'dozen-2nd', 'half-19to36',
                     'other-even', 'other-black'];
      return winningBets;
    case 23:
      winningBets = ['straightup-23', 'split-20-23', 'split-23-24',
                     'split-23-26', 'split-22-23', 'corner-19-20-22-23',
                     'corner-20-21-23-24', 'corner-23-24-26-27',
                     'corner-22-23-25-26', 'column-2nd', 'dozen-2nd',
                     'half-19to36', 'other-odd', 'other-red'];
      return winningBets;
    case 24:
      winningBets = ['straightup-24', 'split-21-24', 'split-24-27',
                     'split-23-24', 'corner-20-21-23-24',
                     'corner-23-24-26-27', 'column-3rd', 'dozen-2nd',
                     'half-19to36', 'other-even', 'other-black'];
      return winningBets;
    case 25:
      winningBets = ['straightup-25', 'split-22-25', 'split-25-26',
                     'split-25-28', 'street-25-26-27',
                     'sixline-22-23-24-25-26-27', 'corner-22-23-25-26',
                     'corner-25-26-28-29', 'sixline-25-26-27-28-29-30',
                     'column-1st', 'dozen-3rd', 'half-19to36',
                     'other-odd', 'other-red'];
      return winningBets;
    case 26:
      winningBets = ['straightup-26', 'split-23-26', 'split-26-27',
                     'split-26-29', 'split-25-26', 'corner-22-23-25-26',
                     'corner-23-24-26-27', 'corner-26-27-29-30',
                     'corner-25-26-28-29', 'column-2nd', 'dozen-3rd',
                     'half-19to36', 'other-even', 'other-black'];
      return winningBets;
    case 27:
      winningBets = ['straightup-27', 'split-24-27', 'split-27-30',
                     'split-26-27', 'corner-23-24-26-27',
                     'corner-26-27-29-30', 'column-3rd', 'dozen-3rd',
                     'half-19to36', 'other-odd', 'other-red'];
      return winningBets;
    case 28:
      winningBets = ['straightup-28', 'split-25-28', 'split-28-29',
                     'split-28-31', 'street-28-29-30',
                     'sixline-25-26-27-28-29-30', 'corner-25-26-28-29',
                     'corner-28-29-31-32', 'sixline-28-29-30-31-32-33',
                     'column-1st', 'dozen-3rd', 'half-19to36',
                     'other-even', 'other-black'];
      return winningBets;
    case 29:
      winningBets = ['straightup-29', 'split-26-29', 'split-29-30',
                     'split-29-32', 'split-28-29', 'corner-25-26-28-29',
                     'corner-26-27-29-30', 'corner-29-30-32-33',
                     'corner-28-29-31-32', 'column-2nd', 'dozen-3rd',
                     'half-19to36', 'other-odd', 'other-black'];
      return winningBets;
    case 30:
      winningBets = ['straightup-30', 'split-27-30', 'split-30-33',
                     'split-29-30', 'corner-26-27-29-30',
                     'corner-29-30-32-33', 'column-3rd', 'dozen-3rd',
                     'half-19to36', 'other-even', 'other-red'];
      return winningBets;
    case 31:
      winningBets = ['straightup-31', 'split-28-31', 'split-31-32',
                     'split-31-34', 'street-31-32-33',
                     'sixline-28-29-30-31-32-33', 'corner-28-29-31-32',
                     'corner-31-32-34-35', 'sixline-31-32-33-34-35-36',
                     'column-1st', 'dozen-3rd', 'half-19to36',
                     'other-odd', 'other-black'];
      return winningBets;
    case 32:
      winningBets = ['straightup-32', 'split-29-32', 'split-32-33',
                     'split-32-35', 'split-31-32', 'corner-28-29-31-32',
                     'corner-29-30-32-33', 'corner-32-33-35-36',
                     'corner-31-32-34-35', 'column-2nd', 'dozen-3rd',
                     'half-19to36', 'other-even', 'other-red'];
      return winningBets;
    case 33:
      winningBets = ['straightup-33', 'split-30-33', 'split-33-36',
                     'split-32-33', 'corner-29-30-32-33',
                     'corner-32-33-35-36', 'column-3rd', 'dozen-3rd',
                     'half-19to36', 'other-odd', 'other-black'];
      return winningBets;
    case 34:
      winningBets = ['straightup-34', 'split-31-34', 'split-34-35',
                     'street-34-35-36', 'sixline-31-32-33-34-35-36',
                     'corner-31-32-34-35', 'column-1st', 'dozen-3rd',
                     'half-19to36', 'other-even', 'other-red'];
      return winningBets;
    case 35:
      winningBets = ['straightup-35', 'split-32-35', 'split-35-36',
                     'split-34-35', 'corner-31-32-34-35',
                     'corner-32-33-35-36', 'column-2nd', 'dozen-3rd',
                     'half-19to36', 'other-odd', 'other-black'];
      return winningBets;
    case 36:
      winningBets = ['straightup-36', 'split-33-36', 'split-35-36',
                     'corner-32-33-35-36', 'column-3rd', 'dozen-3rd',
                     'half-19to36', 'other-even', 'other-red'];
      return winningBets;
  }
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
    context.moveTo(187 - 0, 187 - (outsideRadius + 5));
    context.lineTo(187 + 0, 187 - (outsideRadius + 5));
    context.lineTo(187 + 0, 187 - (outsideRadius - 5));
    context.lineTo(187 + 9, 187 - (outsideRadius - 5));
    context.lineTo(187 + 0, 187 - (outsideRadius - 13));
    context.lineTo(187 - 9, 187 - (outsideRadius - 5));
    context.lineTo(187 - 0, 187 - (outsideRadius - 5));
    context.lineTo(187 - 0, 187 - (outsideRadius + 5));
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

function hide_menu(event) {
  var node = event.target;
  
  while (node != document) {
    if (node == $('#options')[0]) {
      return;
    }
    node = node.parentNode;
  }
  $(document).unbind('click.menu');
  $('#options').css('visibility', 'hidden');
  $('#settings-menu').css('background', '#397564');
  setTimeout(function() {$('#settings-menu').click(show_menu);}, 0);
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
  
  // Initialize scores.
  $('#team1-score').text(gameState['drinks']['team2']);
  $('#team2-score').text(gameState['drinks']['team1']);
  
  // Set min and max display.
  $('#min-number').text(minBet);
  $('#max-number').text(maxBet);
  
  // Setup chip area.
  update_chips(startBank, startBank);
  var currPlayer = gameState['state']['player'];
  if (currPlayer == 'team1') {
    $('#team1-chips').css('background', '#77b3a2');
  } else {
    $('#team2-chips').css('background', '#77b3a2');
  }
  
  $('#form').fadeOut(100, 'linear', function() {
    $('#form').remove();
  });
  $('#title').fadeOut(100, 'linear', function() {
    $('#title').remove();
  });
  
  $('#game-table').fadeIn(100, 'linear');
  
  draw_wheel();
}

// Restacks the a stack of chips after one has been removed.
function restack(betID) {
  var chipStack = $('#' + betID).children();
  var parentMidX = $('#' + betID).width() / 2;
  var parentMidY = $('#' + betID).height() / 2;
  var tokenMid = 10;
  var leftVal = parentMidX - tokenMid;
  var topVal = parentMidY - tokenMid;
  
  $('#' + betID).empty();
  
  var tokenCount = 2;
  for (var i = 0; i < chipStack.size(); i++) {
    var numChipsPlaced = i;
    
    if (numChipsPlaced > 0) {
      topVal = topVal - 2;
    }
    
    var currClass = $(chipStack.get(i)).attr('class');
    var chip = $('<div class="' + currClass + '"></div>');
    chip.css('left', leftVal);
    chip.css('top', topVal);
    chip.css('z-index', tokenCount);
    
    $('#' + betID).append(chip);

    tokenCount++;
  }
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
  update_view('neither', null);
}

function undo() {
  if (gameState['totals']['team1'] == 0 &&
      gameState['totals']['team2'] == 0) {
        alert('No bets have been made.');
  } else {
    if (gameState['state']['undo'] == 0) {
      gameState['state']['undo'] = 1;

      currentPlayer = gameState['state']['player'];

      if (currentPlayer == 'team1') {
        $('#team1-chips').append('<div id=\"team1-undo-flag\">undo <i class=\"icon-remove-sign\"></i></div>');
      } else if (currentPlayer == 'team2') {
        $('#team2-chips').append('<div id=\"team2-undo-flag\">undo <i class=\"icon-remove-sign\"></i></div>');
      } else {
        alert('No team has been selected to play.');
      }
    }
  }
}

function update_board_model(clickedObject) {
  var clickedID = clickedObject.attr('id');
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
        
        update_view(gameState['state']['player'], clickedID);
        
        restack(clickedID);
      } else {
        alert('No more chips to make the bet.');
      }
    } else if (gameState['state']['undo'] == 1) {
      // Undo a bet.
      if (currentPlayerBets > 0 && totalPlayerBets > 0) {
        gameState['bets'][clickedID][currentPlayer] = currentPlayerBets - 1;
        gameState['totals'][currentPlayer] = totalPlayerBets - 1;
        gameState['chips'][currentPlayer] = totalPlayerChips + 1;
        
        // Calculate some vars needed for undoing.
        if (currentPlayer == 'team1') {
          player = 'token ' + team1;
        } else {
          player = 'token ' + team2;
        }
        var chipsHere = $('#' + clickedID).children();
        var count = chipsHere.length - 1;
        var loop = true;
        
        // Remove the current player's most recent bet from the clicked bet.
        while (count >= 0 && loop) {
          var currChip = $(chipsHere.get(count));
          
          if (currChip.attr('class') == player) {
            $($('#' + clickedID).children().get(count)).remove();
            loop = false;
          }
          
          count--;
        }
        
        // Straighten the current chip pile.
        restack(clickedID);
        
        // Update the chip pile.
        update_chips(gameState['chips']['team1'], gameState['chips']['team2']);
      } else if (totalPlayerBets > 0) {
        alert('No bet to remove on this spot.');
      } else {
        alert('Player has no bets to remove.');
      }
    } else if (totalPlayerBets == maxBet) {
      alert('Maximum number of bets have been made.');
    }
  }
}

// Add chips to the table chip piles.
function update_chips(chipsT1, chipsT2) {
  $('#team1-chips').empty();
  $('#team2-chips').empty();
  var parentXMidpoint = 50;
  var parentYMidpoint = 30;
  var tokenMid = 10;
  
  var tokenCount = 2;
  for (var i = 0; i < chipsT1; i++) {
    // Calculate vars needed to position chip.
    var leftVal = parentXMidpoint - tokenMid;
    var topVal = parentYMidpoint - tokenMid;
    
    var numChipsPlaced = i;
    if (numChipsPlaced > 0) {
      topVal = topVal - 2 * numChipsPlaced;
    }
    
    var chipTeam1 = $('<div class="token blue"></div>');
    chipTeam1.css('left', leftVal);
    chipTeam1.css('top', topVal);
    chipTeam1.css('z-index', tokenCount);
    $('#team1-chips').append(chipTeam1);
    
    tokenCount++;
  }
  
  tokenCount = 2;
  for (var j = 0; j < chipsT2; j++) {
    // Calculate vars needed to position chip.
    var leftVal = parentXMidpoint - tokenMid;
    var topVal = parentYMidpoint - tokenMid;
    
    var numChipsPlaced = j;
    if (numChipsPlaced > 0) {
      topVal = topVal - 2 * numChipsPlaced;
    }
    
    var chipTeam2 = $('<div class="token yellow"></div>');
    chipTeam2.css('left', leftVal);
    chipTeam2.css('top', topVal);
    chipTeam2.css('z-index', tokenCount);
    $('#team2-chips').append(chipTeam2);
    
    tokenCount++;
  }
  
  // Update chips count display.
  $('#team1-chips').append('<div class="chip-counts">' + gameState['chips']['team1'] + '</div>');
  $('#team2-chips').append('<div class="chip-counts">' + gameState['chips']['team2'] + '</div>');
  
  if (gameState['state']['undo']) {
    currentPlayer = gameState['state']['player'];

    if (currentPlayer == 'team1') {
      $('#team1-chips').append('<div id=\"team1-undo-flag\">undo</span> <i class=\"icon-remove-sign\"></i></div>');
    } else if (currentPlayer == 'team2') {
      $('#team2-chips').append('<div id=\"team2-undo-flag\">undo <i class=\"icon-remove-sign\"></i></div>');
    } else {
      alert('No bets have been made.');
    }
  }
}

function update_view(player, object) {
  var bets = gameState['bets'];
  var tokenCount = 2;
  
  // Update bets.
  for (var bet in bets) {
    if (bets.hasOwnProperty(bet)) {
      // Show team one's chips on the table.
      if (gameState['bets'][bet]['team1'] > 0 && player == 'team1') {
        if (bet == object) {
          // Calculate vars needed to position chip.
          var parentMidX = $('#' + bet).width() / 2;
          var parentMidY = $('#' + bet).height() / 2;
          var tokenMid = 10;
          var leftVal = parentMidX - tokenMid;
          var topVal = parentMidY - tokenMid;
          
          // Stagger placement of chips so the stack can be seen.
          var numChipsHere = $('#' + bet).children().size();
          if (numChipsHere > 0) {
            topVal = topVal - 2 * numChipsHere;
          }
          
          $('#' + bet).css('position', 'relative');
          $('#' + bet).css('z-index', '1');
          
          // Add chip to the table.
          var chip = $('<div class="token blue"></div>');
          chip.css('left', leftVal);
          chip.css('top', topVal);
          chip.css('z-index', tokenCount);
          $('#' + bet).append(chip);
          
          tokenCount++;
        }
      }
        
      // Show team two's chips on the table.
      if (gameState['bets'][bet]['team2'] > 0 && player == 'team2') {
        if (bet == object) {
          // Calculate vars needed to position chip.
          var parentMidX = $('#' + bet).width() / 2;
          var parentMidY = $('#' + bet).height() / 2;
          var tokenMid = 10;
          var leftVal = parentMidX - tokenMid;
          var topVal = parentMidY - tokenMid;
          
          // Stagger placement of chips so the stack can be seen.
          var numChipsHere = $('#' + bet).children().size();
          if (numChipsHere > 0) {
            topVal = topVal - 2 * numChipsHere;
          }
          
          $('#' + bet).css('position', 'relative');
          $('#' + bet).css('z-index', '1');
          
          // Add chip to the table.
          var chip = $('<div class="token yellow"></div>');
          chip.css('left', leftVal);
          chip.css('top', topVal);
          chip.css('z-index', tokenCount);
          $('#' + bet).append(chip);
          
          tokenCount++;
        }
      } 
    }
  }
  
  update_chips(gameState['chips']['team1'], gameState['chips']['team2']);
  
  // Update scores.
  $('#team1-score').text(gameState['drinks']['team2']);
  $('#team2-score').text(gameState['drinks']['team1']);
}