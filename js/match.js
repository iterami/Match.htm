function button_click(button_id){
    // set button color and value
    document.getElementById(button_id).classList.remove('color10');
    document.getElementById(button_id).classList.add('color' + button_values[button_id]);

    document.getElementById(button_id).value = [
      'ABCDEFGHIJ'[button_values[button_id]],
      button_values[button_id],
      '~!@#$%^&*('[button_values[button_id]]
    ][document.getElementById('display-select').value];

    var loop_counter = 19;
    if(selected_button[0] === -1){// if this is first button of button pair
        // reset other buttons that haven't been matched yet
        do{
            if(button_values[loop_counter] > -1
              && loop_counter !== button_id){
                document.getElementById(loop_counter).classList.remove('color' + button_values[loop_counter]);
                document.getElementById(loop_counter).classList.add('color10');
                document.getElementById(loop_counter).value = '-';
            }
        }while(loop_counter--);

        // store button information
        selected_button = [
          button_values[button_id],
          button_id
        ];

        // disable this button to prevent reclicks
        document.getElementById(button_id).disabled = 1;

    }else{
        document.getElementById('attempted-matches').innerHTML =
          parseInt(document.getElementById('attempted-matches').innerHTML) + 1;

        // if value of this button matches the value of the previously selected button
        if(selected_button[0] === button_values[button_id]){
            // set button values to 0 to prevent them from being reset
            button_values[button_id] = -1;
            button_values[selected_button[1]] = -1;
        }

        // check if there are any enabled buttons left
        var x = 1;
        do{
            document.getElementById(loop_counter).disabled = button_values[loop_counter] < 0
              ? 1
              : 0;

            if(!document.getElementById(loop_counter).disabled){
                x = 0;
            }
        }while(loop_counter--);

        selected_button = [
          -1,
          -1
        ];

        // if not, end game
        if(x){
            stop();
        }
    }
}

function decisecond(){
    // if max-time is set, decrease time by .1sec, else add .1sec
    document.getElementById('time').innerHTML = (
      parseFloat(document.getElementById('time').innerHTML)
      + (document.getElementById('max-time').value > 0
        ? -.1
        : .1
      )
    ).toFixed(1);

    // if time can run out, check if game over
    if(document.getElementById('max-time').value > 0
      && document.getElementById('time').innerHTML <= 0){
        stop();
    }
}

function play_audio(i){
    if(document.getElementById('audio-volume').value > 0){
        document.getElementById(i).volume = document.getElementById('audio-volume').value;
        document.getElementById(i).currentTime = 0;
        document.getElementById(i).play();
    }
}

function reset(){
    if(confirm('Reset settings?')){
        document.getElementById('audio-volume').value = 1;
        document.getElementById('display-select').value = 1;
        document.getElementById('max-time').value = 0;
        document.getElementById('start-key').value = 'H';
        document.getElementById('y-margin').value = 0;

        save();
    }
}

function save(){
    // save settings into localStorage if they differ from settings, else forget
    var loop_counter = 4;
    do{
        var id = [
          'audio-volume',
          'max-time',
          'y-margin',
          'display-select',
          'start-key',
        ][loop_counter];

        if(document.getElementById(id).value == [1, 0, 0, 1, 'H'][loop_counter]){
            window.localStorage.removeItem('Match.htm-' + id);

        }else{
            window.localStorage.setItem(
              'Match.htm-' + id,
              document.getElementById(id).value
            );
        }
    }while(loop_counter--);
}

function showhide(){
    if(document.getElementById('showhide-button').value === '-'){
        document.getElementById('settings-span').style.display = 'none';
        document.getElementById('showhide-button').value = '+';

    }else{
        document.getElementById('settings-span').style.display = 'inline';
        document.getElementById('showhide-button').value = '-';
    }
}

function start(){
    // validate settings
    j = [
      'audio-volume',
      'max-time',
      'y-margin'
    ];
    var loop_counter = 2;
    do{
        if(isNaN(document.getElementById(j[loop_counter]).value)
          || document.getElementById(j[loop_counter]).value < 0){
            document.getElementById(j[loop_counter]).value = [
              1,
              0,
              0
            ][loop_counter];
        }
    }while(loop_counter--);

    // set y margin of table based on settings
    document.getElementById('lol-a-table').style.marginTop = document.getElementById('y-margin').value + 'px';

    var temp = document.getElementById('attempted-matches').innerHTML = 0;

    // generate hidden button pairs
    loop_counter = 19;
    do{
        document.getElementById(loop_counter).disabled = 0;

        j = 9;
        do{
            document.getElementById(loop_counter).classList.remove('color' + j);
        }while(j--);

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

    // disable settings to prevent editing
    document.getElementById('display-select').disabled = 1;
    document.getElementById('max-time').disabled = 1;
    document.getElementById('reset-button').disabled = 1;

    // display time limit if it is greater than 0
    if(document.getElementById('max-time').value > 0){
        document.getElementById('time').innerHTML = document.getElementById('max-time').value;
        document.getElementById('time-max').innerHTML = document.getElementById('max-time').value;
        document.getElementById('if-time-limit').style.display = 'inline';

    }else{
        document.getElementById('time').innerHTML = 0;
        document.getElementById('if-time-limit').style.display = 'none';
    }

    interval = setInterval(
      'decisecond()',
      100
    );
    save();
}

function stop(){
    clearInterval(interval);

    document.getElementById('start-button').value = 'Start [' + document.getElementById('start-key').value + ']';
    document.getElementById('start-button').onclick = function(){
        start();
    };

    // disable all game-area buttons
    var loop_counter = 19;
    do{
        document.getElementById(loop_counter).disabled = 1;
    }while(loop_counter--);

    // blank out button values
    tempinfo = [
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1
    ];
    button_values = [
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1,
      -1,-1,-1,-1,-1
    ];
    selected_buttons = [
      -1,
      -1
    ];

    // enable settings to allow editing
    document.getElementById('display-select').disabled = 0;
    document.getElementById('max-time').disabled = 0;
    document.getElementById('reset-button').disabled = 0;
}

var button_values = [
  -1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1
];
var interval = 0;
var j = [''];
var selected_button = [-1,-1];
var tempinfo = [
  -1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1
];

// setup buttons in game-area
for(var loop_counter = 0; loop_counter < 20; loop_counter++){
    if(loop_counter % 5 === 0
      && loop_counter !== 0){
        j.push('<br>');
    }
    j.push('<input class="buttons color10" disabled id='
      + loop_counter
      + ' onclick=button_click('
      + loop_counter
      + ') type=button value=->'
    );
}
document.getElementById('game-area').innerHTML = j.join('');
j = 0;

// setup settings, get values from localStorage if they are set
document.getElementById('audio-volume').value =
  window.localStorage.getItem('Match.htm-audio-volume') === null
    ? 1
    : parseFloat(window.localStorage.getItem('Match.htm-audio-volume'));
document.getElementById('display-select').value =
  window.localStorage.getItem('Match.htm-display-select') === null
    ? 1
    : window.localStorage.getItem('Match.htm-display-select');
document.getElementById('max-time').value =
  window.localStorage.getItem('Match.htm-max-time') === null
    ? 0
    : parseInt(window.localStorage.getItem('Match.htm-max-time'));
document.getElementById('y-margin').value =
  window.localStorage.getItem('Match.htm-y-margin') === null
    ? 0
    : parseInt(window.localStorage.getItem('Match.htm-y-margin'));

// set value of start-key if saved into localStorage
if(window.localStorage.getItem('Match.htm-start-key') === null){
    document.getElementById('start-key').value = 'H';

}else{
    document.getElementById('start-key').value =
      window.localStorage.getItem('Match.htm-start-key');
    document.getElementById('start-button').value =
      'Start [' + window.localStorage.getItem('Match.htm-start-key') + ']';
}

// set y margin of table based on settings
document.getElementById('lol-a-table').style.marginTop = document.getElementById('y-margin').value + 'px';

window.onkeydown = function(e){
    var key = window.event ? event : e;
    key = key.charCode ? key.charCode : key.keyCode;

    if(String.fromCharCode(key) === document.getElementById('start-key').value){
        stop();
        start();

    }else if(key === 27){// ESC
        stop();
    }
};
