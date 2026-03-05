'use strict';

function button_click(button_id){
    if(core_menu_open){
        return;
    }

    core_elements[button_id].blur();
    core_elements[button_id].style.backgroundColor = core_storage_data['color' + button_values[button_id]];
    core_elements[button_id].textContent = core_storage_data.display[button_values[button_id]];

    if(selected_button[0] === -1){
        for(let i = 0; i < 20; i++){
            if(button_values[i] > -1
              && i !== button_id){
                core_elements[i].style.backgroundColor = '';
                core_elements[i].textContent = ' ';
            }
        }

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
    for(let i = 0; i < 20; i++){
        const disabled = button_values[i] < 0;
        core_elements[i].disabled = disabled;

        if(!disabled){
            buttons_remain = true;
        }
    }

    selected_button = [
      -1,
      -1,
    ];

    if(!buttons_remain){
        core_interval_lock('interval');
        for(let i = 0; i < 20; i++){
            core_elements[i].disabled = true;
        }
    }
}

function decisecond(){
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
        'selected_button': [-1, -1,],
        'time': 0,
      },
      'info': '<button class=medium id=start type=button>Start New Game</button>',
      'menu': true,
      'storage': {
        'color0': '#c83232',
        'color1': '#ff7d0a',
        'color2': '#2d8930',
        'color3': '#6cd',
        'color4': '#f58cba',
        'color5': '#476291',
        'color6': '#fd0',
        'color7': '#8650ac',
        'color8': '#c79c6e',
        'color9': '#70550f',
        'display': '0123456789',
        'height': '50px',
        'width': '50px',
      },
      'storage_menu': '<table><tr><td><input class=mini id=height type=text><td>Button Height'
        + '<tr><td><input class=mini id=width type=text><td>Button Width'
        + '<tr><td><input id=display maxlength=10 type=text><td>Display'
        + '<tr><td>0<input id=color0 type=color><br>'
          + '1<input id=color1 type=color> 2<input id=color2 type=color> 3<input id=color3 type=color><br>'
          + '4<input id=color4 type=color> 5<input id=color5 type=color> 6<input id=color6 type=color><br>'
          + '7<input id=color7 type=color> 8<input id=color8 type=color> 9<input id=color9 type=color><td>Colors'
        + '</table>',
      'title': 'Match.htm',
      'ui_elements': [
        'game',
      ],
    });

    let output = '';
    for(let i = 0; i < 20; i++){
        if(i % 5 === 0
          && i !== 0){
            output += '<br>';
        }
        output += '<button class=gridbuttonclickable id=' + i
          + ' onclick=button_click(' + i + ') type=button></button>';
    }
    core_elements.game.innerHTML = output;

    for(let i = 0; i < 20; i++){
        core_elements[i] = document.getElementById(i);
    }
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

    const values = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,];
    for(let i = 0; i < 20; i++){
        core_elements[i].disabled = false;
        core_elements[i].style.backgroundColor = '';
        core_elements[i].style.color = '#000';
        core_elements[i].style.height = core_storage_data.height;
        core_elements[i].style.width = core_storage_data.width;
        core_elements[i].textContent = ' ';

        button_values[i] = core_random_splice(values);
    }

    core_elements.game.style.minWidth = (core_elements[0].offsetWidth * 5 + 10) + 'px';

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
    reset();
    if(core_menu_open){
        core_escape();
    }

    core_interval_modify({
      'id': 'interval',
      'interval': 100,
      'todo': decisecond,
    });
}
