'use strict';

function button_click(button_id){
    // Set button color and value.
    document.getElementById(button_id).classList.remove('color10');
    document.getElementById(button_id).classList.add('color' + button_values[button_id]);

    document.getElementById(button_id).value = [
      'ABCDEFGHIJ'[button_values[button_id]],
      button_values[button_id],
      '~!@#$%^&*('[button_values[button_id]]
    ][document.getElementById('display-select').value];

    var loop_counter = 19;
    // If this is first button of button pair.
    if(selected_button[0] === -1){
        // Reset other buttons that haven't been matched yet.
        do{
            if(button_values[loop_counter] > -1
              && loop_counter !== button_id){
                document.getElementById(loop_counter).classList.remove('color' + button_values[loop_counter]);
                document.getElementById(loop_counter).classList.add('color10');
                document.getElementById(loop_counter).value = '-';
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

    document.getElementById('attempted-matches').innerHTML =
      parseInt(document.getElementById('attempted-matches').innerHTML) + 1;

    // If value of this button matches the value of the previously selected button.
    if(selected_button[0] === button_values[button_id]){
        // Set button values to -1 to prevent them from being reset.
        button_values[button_id] = -1;
        button_values[selected_button[1]] = -1;
    }

    // Check if there are any enabled buttons left.
    var buttons_remain = false;
    do{
        document.getElementById(loop_counter).disabled = button_values[loop_counter] < 0;

        if(!document.getElementById(loop_counter).disabled){
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
    document.getElementById('time').innerHTML = (
      parseFloat(document.getElementById('time').innerHTML)
      + (document.getElementById('max-time').value > 0
        ? -.1
        : .1
      )
    ).toFixed(1);

    // If time can run out, check if game over.
    if(document.getElementById('max-time').value > 0
      && document.getElementById('time').innerHTML <= 0){
        stop();
    }
}

function play_audio(id){
    if(document.getElementById('audio-volume').value <= 0){
        return;
    }

    document.getElementById(id).volume = document.getElementById('audio-volume').value;
    document.getElementById(id).currentTime = 0;
    document.getElementById(id).play();
}

function reset(){
    if(!window.confirm('Reset settings?')){
        return;
    }

    document.getElementById('audio-volume').value = 1;
    document.getElementById('display-select').value = 1;
    document.getElementById('max-time').value = 0;
    document.getElementById('start-key').value = 'H';
    document.getElementById('y-margin').value = 0;

    save();
}

// Save settings into window.localStorage if they differ from default.
function save(){
    var ids = {
      'audio-volume': 1,
      'display-select': 1,
      'max-time': 0,
      'start-key': 'H',
      'y-margin': 0,
    };
    for(var id in ids){
        if(document.getElementById(id).value == ids[id]){
            window.localStorage.removeItem('Match.htm-' + id);

        }else{
            window.localStorage.setItem(
              'Match.htm-' + id,
              document.getElementById(id).value
            );
        }
    }
}

function settings_toggle(state){
    state = state == void 0
      ? document.getElementById('settings-button').value === '+'
      : state;

    if(state){
        document.getElementById('settings-span').style.display = 'inline';
        document.getElementById('settings-button').value = '-';

    }else{
        document.getElementById('settings-span').style.display = 'none';
        document.getElementById('settings-button').value = '+';
    }
}

function start(){
    document.getElementById('attempted-matches').innerHTML = 0;

    // Validate settings.
    var ids = {
      'audio-volume': 1,
      'max-time': 0,
      'y-margin': 0,
    };
    for(var id in ids){
        if(isNaN(document.getElementById(id).value)
          || document.getElementById(id).value < 0){
            document.getElementById(id).value = ids[id];
        }
    }

    // Set margin-top of table based on y-margin.
    document.getElementById('table').style.marginTop = document.getElementById('y-margin').value + 'px';

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

        var pairs_counter = 9;
        do{
            document.getElementById(loop_counter).classList.remove('color' + pairs_counter);
        }while(pairs_counter--);

        document.getElementById(loop_counter).classList.add('color10');
        document.getElementById(loop_counter).value = '-';

        do{
            temp = Math.floor(Math.random() * 20);
        }while(tempinfo[temp] != -1);

        tempinfo[temp] = Math.floor(temp / 2);
        button_values[loop_counter] = Math.floor(temp / 2);
    }while(loop_counter--);

    document.getElementById('start-button').value = 'End [ESC]';
    document.getElementById('start-button').onclick = function(){
        stop();
    };

    // Disable settings to prevent editing.
    document.getElementById('display-select').disabled = true;
    document.getElementById('max-time').disabled = true;
    document.getElementById('reset-button').disabled = true;

    // Display time limit if it is greater than 0.
    if(document.getElementById('max-time').value > 0){
        document.getElementById('time').innerHTML = document.getElementById('max-time').value;
        document.getElementById('time-max').innerHTML = document.getElementById('max-time').value;
        document.getElementById('if-time-limit').style.display = 'inline';

    }else{
        document.getElementById('time').innerHTML = 0;
        document.getElementById('if-time-limit').style.display = 'none';
    }

    interval = window.setInterval(
      'decisecond()',
      100
    );
    save();
}

function stop(){
    window.clearInterval(interval);

    document.getElementById('start-button').value = 'Start [' + document.getElementById('start-key').value + ']';
    document.getElementById('start-button').onclick = function(){
        start();
    };

    // Disable all game-area buttons.
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

    // Enable settings to allow editing.
    document.getElementById('display-select').disabled = false;
    document.getElementById('max-time').disabled = false;
    document.getElementById('reset-button').disabled = false;
}

var button_values = [
  -1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,
];
var interval = 0;
var selected_button = [-1, -1,];

window.onkeydown = function(e){
    var key = e.keyCode || e.which;

    if(String.fromCharCode(key) === document.getElementById('start-key').value){
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

window.onload = function(){
    // Fetch settings from window.localStorage and update settings inputs.
    document.getElementById('audio-volume').value =
      parseFloat(window.localStorage.getItem('Match.htm-audio-volume')) || 1,
    document.getElementById('display-select').value =
      window.localStorage.getItem('Match.htm-display-select') || 1;
    document.getElementById('max-time').value =
      parseInt(window.localStorage.getItem('Match.htm-max-time')) || 0;
    document.getElementById('y-margin').value =
      parseInt(window.localStorage.getItem('Match.htm-y-margin')) || 0;

    // Set value of start-key if saved into window.localStorage.
    if(window.localStorage.getItem('Match.htm-start-key') === null){
        document.getElementById('start-key').value = 'H';

    }else{
        document.getElementById('start-key').value =
          window.localStorage.getItem('Match.htm-start-key');
        document.getElementById('start-button').value =
          'Start [' + window.localStorage.getItem('Match.htm-start-key') + ']';
    }

    // Set margin-top of table based on y-margin.
    document.getElementById('table').style.marginTop = document.getElementById('y-margin').value + 'px';

    // Setup buttons in game-area.
    var output = [''];

    for(var loop_counter = 0; loop_counter < 20; loop_counter++){
        if(loop_counter % 5 === 0
          && loop_counter !== 0){
            output.push('<br>');
        }
        output.push('<input class="buttons color10" disabled id='
          + loop_counter
          + ' onclick=button_click('
          + loop_counter
          + ') type=button value=->'
        );
    }
    document.getElementById('game-area').innerHTML = output.join('');
};
