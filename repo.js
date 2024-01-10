'use strict';

function button_click(button_id){
    if(core_menu_open){
        return;
    }

    let element = document.getElementById(button_id);
    element.style.backgroundColor = colors[button_values[button_id]];
    element.value = core_storage_data['display'][button_values[button_id]];

    let loop_counter = 19;
    if(selected_button[0] === -1){
        do{
            if(button_values[loop_counter] > -1
              && loop_counter !== button_id){
                element = document.getElementById(loop_counter);
                element.style.backgroundColor = colors['default'];
                element.value = ' ';
            }
        }while(loop_counter--);

        selected_button = [
          button_values[button_id],
          button_id,
        ];

        document.getElementById(button_id).disabled = true;

        return;
    }

    element = document.getElementById('attempted-matches');
    element.textContent = Number.parseInt(
      element.textContent,
      10
    ) + 1;

    if(selected_button[0] === button_values[button_id]){
        button_values[button_id] = -1;
        button_values[selected_button[1]] = -1;

        audio_start({
          'id': 'boop',
        });
    }

    let buttons_remain = false;
    do{
        const disabled = button_values[loop_counter] < 0;
        document.getElementById(loop_counter).disabled = disabled;

        if(!disabled){
            buttons_remain = true;
        }
    }while(loop_counter--);

    selected_button = [
      -1,
      -1,
    ];

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
    core_elements['time'].textContent = core_number_format({
      'decimals-min': 1,
      'number': time,
    });
}

function repo_escape(){
    if(!core_intervals['interval']
      && !core_menu_open){
        core_repo_reset();
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'start-button': {
          'onclick': core_repo_reset,
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
      'menu': true,
      'reset': function(){
          stop();
          if(core_menu_open){
              core_escape();
          }
          start();
      },
      'storage': {
        'display': '0123456789',
      },
      'storage-menu': '<table><tr><td><input id=display maxlength=10 type=text><td>Display</table>',
      'title': 'Match.htm',
    });
    audio_create({
      'audios': {
        'boop': {
          'duration': .1,
        },
      },
    });
    core_html_store([
      'time',
    ]);

    let output = '';
    for(let loop_counter = 0; loop_counter < 20; loop_counter++){
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

    let loop_counter = 19;
    do{
        document.getElementById(loop_counter).style.backgroundColor = colors['default'];
    }while(loop_counter--);
}

function start(){
    document.getElementById('attempted-matches').textContent = 0;

    let loop_counter = 19;
    const tempinfo = [
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
    ];
    let temp = 0;
    do{
        const element = document.getElementById(loop_counter);
        element.disabled = false;
        element.style.backgroundColor = colors['default'];
        element.value = ' ';

        do{
            temp = core_random_integer({
              'max': 20,
            });
        }while(tempinfo[temp] !== -1);

        tempinfo[temp] = Math.floor(temp / 2);
        button_values[loop_counter] = Math.floor(temp / 2);
    }while(loop_counter--);

    time = 0;
    core_elements['time'].textContent = time;

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

    let loop_counter = 19;
    do{
        document.getElementById(loop_counter).disabled = true;
    }while(loop_counter--);

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
