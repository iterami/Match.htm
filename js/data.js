'use strict';

function button_click(button_id){
    if(core_menu_open){
        return;
    }

    // Set button color and value.
    let element = document.getElementById(button_id);
    element.style.background = colors[button_values[button_id]];
    element.value = core_storage_data['display'][button_values[button_id]];

    let loop_counter = 19;
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
    element.innerHTML = Number.parseInt(
      element.innerHTML,
      10
    ) + 1;

    // If value of this button matches the value of the previously selected button.
    if(selected_button[0] === button_values[button_id]){
        // Set button values to -1 to prevent them from being reset.
        button_values[button_id] = -1;
        button_values[selected_button[1]] = -1;

        audio_start({
          'id': 'boop',
        });
    }

    // Check if there are any enabled buttons left.
    let buttons_remain = false;
    do{
        let disabled = button_values[loop_counter] < 0;
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
    if(core_mode === 0){
        stop();
        return;
    }

    time = core_round({
      'decimals': 1,
      'number': Number.parseFloat(time) + .1,
    });
    core_elements['time'].innerHTML = time;
}

function start(){
    document.getElementById('attempted-matches').innerHTML = 0;

    // Generate button pairs.
    let loop_counter = 19;
    let tempinfo = [
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
    ];
    let temp = 0;
    do{
        let element = document.getElementById(loop_counter);
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

    time = 0;
    core_elements['time'].innerHTML = time;

    core_mode = 1;
    core_interval_modify({
      'id': 'interval',
      'interval': 100,
      'todo': decisecond,
    });
}

function stop(){
    core_interval_pause_all();
    core_mode = 0;

    // Disable all game-div buttons.
    let loop_counter = 19;
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
