'use strict';

function button_click(button_id){
    // Set button color and value.
    document.getElementById(button_id).style.background = colors[button_values[button_id]];

    document.getElementById(button_id).value = [
      'ABCDEFGHIJ'[button_values[button_id]],
      button_values[button_id],
      '~!@#$%^&*('[button_values[button_id]]
    ][storage_data['display']];

    var loop_counter = 19;
    // If this is first button of button pair.
    if(selected_button[0] === -1){
        // Reset other buttons that haven't been matched yet.
        do{
            if(button_values[loop_counter] > -1
              && loop_counter !== button_id){
                document.getElementById(loop_counter).style.background = colors['default'];
                document.getElementById(loop_counter).value = ' ';
            }
        }while(loop_counter--);

        // Store button information.
        selected_button = [
          button_values[button_id],
          button_id,
        ];

        // Disable this button to prevent reclicks.
        document.getElementById(button_id).disabled = true;

        return;
    }

    document.getElementById('attempted-matches').innerHTML = parseInt(
      document.getElementById('attempted-matches').innerHTML,
      10
    ) + 1;

    // If value of this button matches the value of the previously selected button.
    if(selected_button[0] === button_values[button_id]){
        // Set button values to -1 to prevent them from being reset.
        button_values[button_id] = -1;
        button_values[selected_button[1]] = -1;

        audio_start({
          'id': 'boop',
          'volume-multiplier': storage_data['audio-volume'],
        });
    }

    // Check if there are any enabled buttons left.
    var buttons_remain = false;
    do{
        var disabled = button_values[loop_counter] < 0;
        document.getElementById(loop_counter).disabled = disabled;

        if(!disabled){
            buttons_remain = true;
        }
    }while(loop_counter--);

    selected_button = [
      -1,
      -1,
    ];

    // If not, end game.
    if(!buttons_remain){
        stop();
    }
}

function decisecond(){
    // If max-time is set, decrease time by .1sec, else add .1sec.
    time = storage_data['max-time'] > 0
      ? (parseFloat(time) - .1).toFixed(1)
      : (parseFloat(time) + .1).toFixed(1);

    document.getElementById('time').innerHTML = time;

    // If time can run out, check if game over.
    if(storage_data['max-time'] > 0
      && time <= 0){
        stop();
    }
}

function settings_toggle(state){
    state = state == void 0
      ? document.getElementById('settings-button').value === '+'
      : state;

    if(state){
        document.getElementById('settings').style.display = 'inline-block';
        document.getElementById('settings-button').value = '-';

    }else{
        document.getElementById('settings').style.display = 'none';
        document.getElementById('settings-button').value = '+';
    }
}

function start(){
    storage_save();

    document.getElementById('attempted-matches').innerHTML = 0;

    // Set margin-top of game-div based on y-margin.
    document.getElementById('game-div').style.marginTop = storage_data['y-margin'] + 'px';

    // Generate button pairs.
    var loop_counter = 19;
    var tempinfo = [
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
    ];
    var temp = 0;
    do{
        document.getElementById(loop_counter).disabled = false;
        document.getElementById(loop_counter).style.background = colors['default'];
        document.getElementById(loop_counter).value = ' ';

        do{
            temp = random_integer({
              'max': 20,
            });
        }while(tempinfo[temp] != -1);

        tempinfo[temp] = Math.floor(temp / 2);
        button_values[loop_counter] = Math.floor(temp / 2);
    }while(loop_counter--);

    document.getElementById('start-button').value = 'End [ESC]';
    document.getElementById('start-button').onclick = stop;

    // Display time limit if it is greater than 0.
    if(storage_data['max-time'] > 0){
        document.getElementById('if-time-limit').style.display = 'inline';
        document.getElementById('time-max').innerHTML = storage_data['max-time'];
        time = storage_data['max-time'];

    }else{
        document.getElementById('if-time-limit').style.display = 'none';
        time = 0;
    }

    document.getElementById('time').innerHTML = time;

    interval = window.setInterval(
      decisecond,
      100
    );
}

function stop(){
    window.clearInterval(interval);

    document.getElementById('start-button').value = 'Start [' + storage_data['start-key'] + ']';
    document.getElementById('start-button').onclick = start;

    // Disable all game-div buttons.
    var loop_counter = 19;
    do{
        document.getElementById(loop_counter).disabled = true;
    }while(loop_counter--);

    // Blank out button values.
    button_values = [
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
    ];
    selected_button = [
      -1,
      -1,
    ];
}

var button_values = [
  -1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,
];
var colors = {
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
};
var interval = 0;
var selected_button = [-1, -1,];
var time = 0;

window.onload = function(){
    storage_init({
      'data': {
        'audio-volume': 1,
        'display': 1,
        'max-time': 0,
        'start-key': 'H',
        'y-margin': 0,
      },
      'prefix': 'Match.htm-',
    });
    audio_init({
      'volume': storage_data['audio-volume'],
    });
    audio_create({
      'id': 'boop',
      'properties': {
        'duration': .1,
        'volume': .1,
      },
    });

    document.getElementById('settings').innerHTML =
      '<tr><td colspan=2><input id=reset-button onclick=storage_reset() type=button value=Reset>'
        + '<tr><td><input id=audio-volume max=1 min=0 step=0.01 type=range><td>Audio'
        + '<tr><td><select id=display><option value=0>Letters</option><option value=1>Numbers</option><option value=2>Symbols</option></select><td>Display'
        + '<tr><td><input id=max-time><td>Max Time'
        + '<tr><td><input id=start-key maxlength=1><td>Start'
        + '<tr><td><input id=y-margin><td>Y Margin';
    storage_update();

    // Set margin-top of game-div based on y-margin.
    document.getElementById('game-div').style.marginTop = document.getElementById('y-margin').value + 'px';

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

    document.getElementById('settings-button').onclick = function(){
        settings_toggle();
    };
    document.getElementById('start-button').onclick = start;

    stop();

    window.onkeydown = function(e){
        var key = e.keyCode || e.which;

        if(String.fromCharCode(key) === storage_data['start-key']){
            stop();
            start();

        // ESC: stop current game.
        }else if(key === 27){
            stop();

        // +: show settings.
        }else if(key === 187){
            settings_toggle(true);

        // -: hide settings.
        }else if(key === 189){
            settings_toggle(false);
        }
    };
};
