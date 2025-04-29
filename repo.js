'use strict';

function button_click(button_id){
    if(core_menu_open){
        return;
    }

    core_elements[button_id].blur();
    core_elements[button_id].style.backgroundColor = colors[button_values[button_id]];
    core_elements[button_id].textContent = core_storage_data['display'][button_values[button_id]];

    let loop_counter = 19;
    if(selected_button[0] === -1){
        do{
            if(button_values[loop_counter] > -1
              && loop_counter !== button_id){
                core_elements[loop_counter].style.backgroundColor = '';
                core_elements[loop_counter].textContent = ' ';
            }
        }while(loop_counter--);

        selected_button = [
          button_values[button_id],
          button_id,
        ];

        core_elements[button_id].disabled = true;

        return;
    }

    core_ui_update({
      'ids': {
        'attempted-matches': Number.parseInt(
          core_elements['attempted-matches'].textContent,
          10
        ) + 1,
      },
    });

    if(selected_button[0] === button_values[button_id]){
        button_values[button_id] = -1;
        button_values[selected_button[1]] = -1;
        core_elements[button_id].style.color = '#fff';
        core_elements[selected_button[1]].style.color = '#fff';

        audio_start('boop');
    }

    let buttons_remain = false;
    do{
        const disabled = button_values[loop_counter] < 0;
        core_elements[loop_counter].disabled = disabled;

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
        return;
    }

    time = core_round({
      'decimals': 1,
      'number': Number.parseFloat(time) + .1,
    });
    core_ui_update({
      'ids': {
        'time': core_number_format({
          'decimals-min': 1,
          'number': time,
        }),
      },
    });
}

function repo_escape(){
    if(!core_intervals['interval']
      && !core_menu_open){
        reset();
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'start-button': {
          'onclick': reset,
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
      'info': '<button id=start-button type=button>Restart</button>',
      'menu': true,
      'storage': {
        'display': '0123456789',
        'height': 50,
        'width': 50,
      },
      'storage-menu': '<table><tr><td><input class=mini id=height min=1 step=any type=number><td>Button Height'
        + '<tr><td><input class=mini id=width min=1 step=any type=number><td>Button Width'
        + '<tr><td><input id=display maxlength=10 type=text><td>Display</table>',
      'title': 'Match.htm',
    });

    let output = '';
    for(let loop_counter = 0; loop_counter < 20; loop_counter++){
        if(loop_counter % 5 === 0
          && loop_counter !== 0){
            output += '<br>';
        }
        output +=
          '<button class=gridbuttonclickable disabled id=' + loop_counter
          + ' onclick=button_click(' + loop_counter
          + ') type=button> </button>';
    }
    document.getElementById('game-div').innerHTML = output + '<br>';

    let loop_counter = 19;
    do{
        core_elements[loop_counter] = document.getElementById(loop_counter);
        core_elements[loop_counter].style.backgroundColor = '';
        core_elements[loop_counter].style.height = core_storage_data['height'] + 'px';
        core_elements[loop_counter].style.width = core_storage_data['width'] + 'px';
    }while(loop_counter--);
}

function reset(){
    stop();
    if(core_menu_open){
        core_escape();
    }
    start();
}

function start(){
    let loop_counter = 19;
    const temp = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,];
    do{
        core_elements[loop_counter].disabled = false;
        core_elements[loop_counter].style.backgroundColor = '';
        core_elements[loop_counter].style.color = '#000';
        core_elements[loop_counter].style.height = core_storage_data['height'] + 'px';
        core_elements[loop_counter].style.width = core_storage_data['width'] + 'px';
        core_elements[loop_counter].textContent = ' ';

        button_values[loop_counter] = core_random_splice(temp);
    }while(loop_counter--);

    time = 0;
    core_ui_update({
      'ids': {
        'attempted-matches': 0,
        'time': 0,
      },
    });

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
        core_elements[loop_counter].disabled = true;
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
