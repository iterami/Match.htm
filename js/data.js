'use strict';

function button_click(button_id){
    // Set button color and value.
    var element = document.getElementById(button_id);
    element.style.background = colors[button_values[button_id]];

    element.value = [
      'ABCDEFGHIJ'[button_values[button_id]],
      button_values[button_id],
      '~!@#$%^&*('[button_values[button_id]]
    ][core_storage_data['display']];

    var loop_counter = 19;
    // If this is first button of button pair.
    if(selected_button[0] === -1){
        // Reset other buttons that haven't been matched yet.
        do{
            if(button_values[loop_counter] > -1
              && loop_counter !== button_id){
                element = document.getElementById(loop_counter);
                element.style.background = colors['default'];
                element.value = ' ';
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

    element = document.getElementById('attempted-matches');
    element.innerHTML = parseInt(
      element.innerHTML,
      10
    ) + 1;

    // If value of this button matches the value of the previously selected button.
    if(selected_button[0] === button_values[button_id]){
        // Set button values to -1 to prevent them from being reset.
        button_values[button_id] = -1;
        button_values[selected_button[1]] = -1;

        core_audio_start({
          'id': 'boop',
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
    time = core_storage_data['max-time'] > 0
      ? (parseFloat(time) - .1).toFixed(1)
      : (parseFloat(time) + .1).toFixed(1);

    document.getElementById('time').innerHTML = time;

    // If time can run out, check if game over.
    if(core_storage_data['max-time'] > 0
      && time <= 0){
        stop();
    }
}

function start(){
    if(core_menu_open){
        core_escape();
    }

    document.getElementById('attempted-matches').innerHTML = 0;

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
        var element = document.getElementById(loop_counter);
        element.disabled = false;
        element.style.background = colors['default'];
        element.value = ' ';

        do{
            temp = core_random_integer({
              'max': 20,
            });
        }while(tempinfo[temp] != -1);

        tempinfo[temp] = Math.floor(temp / 2);
        button_values[loop_counter] = Math.floor(temp / 2);
    }while(loop_counter--);

    // Display time limit if it is greater than 0.
    if(core_storage_data['max-time'] > 0){
        document.getElementById('if-time-limit').style.display = 'inline';
        document.getElementById('time-max').innerHTML = core_storage_data['max-time'];
        time = core_storage_data['max-time'];

    }else{
        document.getElementById('if-time-limit').style.display = 'none';
        time = 0;
    }

    document.getElementById('time').innerHTML = time;

    core_interval_modify({
      'id': 'interval',
      'interval': 100,
      'todo': decisecond,
    });
}

function stop(){
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
