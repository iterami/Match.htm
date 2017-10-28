'use strict';

function repo_init(){
    core_repo_init({
      'audios': {
        'boop': {
          'duration': .1,
        },
      },
      'events': {
        'start-button': {
          'onclick': start,
        },
      },
      'globals': {
        'button_values': [
          -1,-1,-1,-1,-1,
          -1,-1,-1,-1,-1,
          -1,-1,-1,-1,-1,
          -1,-1,-1,-1,-1,
        ],
        'colors': {
          'default': '#2a2a2a',
          '0': '#c83232',
          '1': '#ff7d0a',
          '2': '#2d8930',
          '3': '#6cd',
          '4': '#f58cba',
          '5': '#476291',
          '6': '#fd0',
          '7': '#8650ac',
          '8': '#c79c6e',
          '9': '#70550f',
        },
        'selected_button': [-1, -1,],
        'time': 0,
      },
      'info': '<input id=start-button type=button value=Restart>',
      'keybinds': {
        72: {
          'todo': function(){
              stop();
              start();
          },
        },
      },
      'storage': {
        'display': 1,
        'max-time': 0,
      },
      'storage-menu': '<table><tr><td><select id=display><option value=0>Letters</option><option value=1>Numbers</option><option value=2>Symbols</option></select><td>Display<tr><td><input id=max-time><td>Max Time</table>',
      'title': 'Match.htm',
    });

    // Setup buttons in game-div.
    var output = '';
    for(var loop_counter = 0; loop_counter < 20; loop_counter++){
        if(loop_counter % 5 === 0
          && loop_counter !== 0){
            output += '<br>';
        }
        output +=
          '<input class=gridbuttonclickable disabled id=' + loop_counter
          + ' onclick=button_click(' + loop_counter
          + ') type=button value=" ">';
    }
    document.getElementById('game-div').innerHTML = output + '<br>';

    var loop_counter = 19;
    do{
        document.getElementById(loop_counter).style.background = colors['default'];
    }while(loop_counter--);

    start();
}
