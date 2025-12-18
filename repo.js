'use strict';

function button_click(button_id){
    if(core_menu_open){
        return;
    }

    core_elements[button_id].blur();
    core_elements[button_id].style.backgroundColor = colors[button_values[button_id]];
    core_elements[button_id].textContent = core_storage_data.display[button_values[button_id]];

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
        'attempts': Number.parseInt(
          core_elements.attempts.textContent,
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
        core_mode = 0;
        core_interval_pause_all();
        let loop_counter = 19;
        do{
            core_elements[loop_counter].disabled = true;
        }while(loop_counter--);
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
          'decimals_min': 1,
          'number': time,
        }),
      },
    });
}

function repo_escape(){
    if(!core_intervals.interval
      && !core_menu_open){
        start();
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'start': {
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
      'info': '<button id=start type=button>Start New Game</button>',
      'menu': true,
      'storage': {
        'display': '0123456789',
        'height': '50px',
        'length': 5,
        'width': '50px',
      },
      'storage_menu': '<table><tr><td><input class=mini id=height type=text><td>Button Height'
        + '<tr><td><input class=mini id=width type=text><td>Button Width'
        + '<tr><td><input class=mini id=length max=20 min=1 step=1 type=number><td>Length'
        + '<tr><td><input id=display maxlength=10 type=text><td>Display</table>',
      'title': 'Match.htm',
      'ui_elements': [
        'game',
      ],
    });
}

function reset(){
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

    let output = '';
    for(let loop_counter = 0; loop_counter < 20; loop_counter++){
        if(loop_counter % core_storage_data.length === 0
          && loop_counter !== 0){
            output += '<br>';
        }
        output +=
          '<button class=gridbuttonclickable id=' + loop_counter
          + ' onclick=button_click(' + loop_counter + ') type=button></button>';
    }
    core_elements.game.innerHTML = output + '<br>';

    for(const element in core_elements){
        if(!globalThis.isNaN(element)){
            delete core_elements[element];
        }
    }
    let loop_counter = 19;
    const temp = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,];
    do{
        core_elements[loop_counter] = document.getElementById(loop_counter);
        core_elements[loop_counter].disabled = false;
        core_elements[loop_counter].style.backgroundColor = '';
        core_elements[loop_counter].style.color = '#000';
        core_elements[loop_counter].style.height = core_storage_data.height;
        core_elements[loop_counter].style.width = core_storage_data.width;
        core_elements[loop_counter].textContent = ' ';

        button_values[loop_counter] = core_random_splice(temp);
    }while(loop_counter--);

    core_elements.game.style.minWidth = (core_elements[0].offsetWidth * core_storage_data.length + core_storage_data.length * 2) + 'px';

    time = 0;
    core_ui_update({
      'ids': {
        'attempts': 0,
        'time': 0,
      },
    });
}

function start(){
    if(time > 0
      && !globalThis.confirm('Start new game?')){
        return;
    }
    if(core_menu_open){
        core_escape();
    }
    reset();

    core_mode = 1;
    core_interval_modify({
      'id': 'interval',
      'interval': 100,
      'todo': decisecond,
    });
}
