function button_click(button_id){
    /*set button color and value*/
    get(button_id).classList.remove('color10');
    get(button_id).classList.add('color'+button_values[button_id]);
    get(button_id).value = [
        'ABCDEFGHIJ'[button_values[button_id]],
        button_values[button_id],
        '~!@#$%^&*('[button_values[button_id]]
    ][get('display-select').value];

    i = 19;
    if(selected_button[0]===-1){/*if this is first button of button pair*/
        /*reset other buttons that haven't been matched yet*/
        do{
            if(button_values[i]>-1 && i!==button_id){
                get(i).classList.remove('color'+button_values[i]);
                get(i).classList.add('color10');
                get(i).value = '-'
            }
        }while(i--);

        /*store button information*/
        selected_button = [button_values[button_id],button_id];

        /*disable this button to prevent reclicks*/
        get(button_id).disabled = 1
    }else{
        get('attempted-matches').innerHTML = parseInt(get('attempted-matches').innerHTML)+1;

        /*if value of this button matches the value of the previously selected button*/
        if(selected_button[0]===button_values[button_id]){
            /*set button values to 0 to prevent them from being reset*/
            button_values[selected_button[1]] = button_values[button_id] = -1;
        }

        /*check if there are any enabled buttons left*/
        var x = 1;
        do{
            get(i).disabled = button_values[i]<0 ? 1 : 0;
            if(!get(i).disabled){
                x = 0
            }
        }while(i--);

        selected_button = [-1,-1];

        /*if not, end game*/
        if(x){
            stop()
        }
    }
}
function decisecond(){
    /*if max-time is set, decrease time by .1sec, else add .1sec*/
    get('time').innerHTML = (parseFloat(get('time').innerHTML)+(get('max-time').value>0 ? -.1 : .1)).toFixed(1);

    /*if time can run out, check if game over*/
    if(get('max-time').value>0 && get('time').innerHTML<=0){
        stop()
    }
}
function get(i){
    return document.getElementById(i)
}
function play_audio(i){
    if(get('audio-volume').value>0){
        get(i).volume = get('audio-volume').value;
        get(i).currentTime = 0;
        get(i).play()
    }
}
function reset(){
    if(confirm('Reset settings?')){
        get('display-select').value = get('audio-volume').value = 1;
        get('start-key').value = 'H';
        get('max-time').value = get('y-margin').value = 0;
        save()
    }
}
function save(){
    /*save settings into localStorage if they differ from settings, else forget*/
    i = 4;
    j = ['audio-volume','max-time','y-margin','display-select','start-key'];
    do{
        if(get(j[i]).value==[1,0,0,1,'H'][i]){
            ls.removeItem('match'+i)
        }else{
            ls.setItem('match'+i,get(j[i]).value)
        }
    }while(i--);
    j = 0
}
function showhide(){
    i=get('showhide-button').value==='-' ? 1 : 0;
    get('settings-span').style.display = ['inline','none'][i];
    get('showhide-button').value = ['-','+'][i]
}
function start(){
    /*validate settings*/
    i = 2;
    j = ['audio-volume','max-time','y-margin'];
    do{
        if(isNaN(get(j[i]).value) || get(j[i]).value<0){
            get(j[i]).value = [1,0,0][i]
        }
    }while(i--);

    /*set y margin of table based on settings*/
    get('lol-a-table').style.marginTop = get('y-margin').value+'px';

    var temp = get('attempted-matches').innerHTML = 0;

    /*generate hidden button pairs*/
    i=19;
    do{
        get(i).disabled = 0;

        j = 9;
        do{
            get(i).classList.remove('color'+j)
        }while(j--);

        get(i).classList.add('color10');
        get(i).value = '-';

        do{
            temp = Math.floor(Math.random()*20)
        }while(tempinfo[temp]!=-1);

        tempinfo[temp] = Math.floor(temp/2);
        button_values[i] = Math.floor(temp/2)
    }while(i--);

    get('start-button').value = 'End (ESC)';
    get('start-button').onclick = function(){stop()};

    /*disable settings to prevent editing*/
    get('display-select').disabled = get('reset-button').disabled = get('max-time').disabled = 1;

    /*display time limit if it is greater than 0*/
    if(get('max-time').value>0){
        get('time').innerHTML = get('time-max').innerHTML = get('max-time').value;
        get('if-time-limit').style.display = 'inline'
    }else{
        get('time').innerHTML = 0;
        get('if-time-limit').style.display = 'none'
    }

    interval = setInterval('decisecond()',100);
    save()
}
function stop(){
    clearInterval(interval);

    get('start-button').value = 'Start ('+get('start-key').value+')';
    get('start-button').onclick = function(){start()};

    /*disable all game-area buttons*/
    i = 19;
    do{
        get(i).disabled = 1
    }while(i--);

    /*blank out button values*/
    tempinfo = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
    button_values = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
    selected_buttons = [-1,-1];

    /*enable settings to allow editing*/
    get('display-select').disabled = get('reset-button').disabled = get('max-time').disabled = 0
}
var button_values = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
var i = 0;
var interval = 0;
var j = [''];
var ls = window.localStorage;
var selected_button = [-1,-1];
var tempinfo = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

/*setup buttons in game-area*/
for(i=0;i<20;i++){
    if(i%5===0 && i!==0){
        j.push('<br>')
    }
    j.push('<input class="buttons color10" disabled id='+i+' onclick=button_click('+i+') type=button value=->')
}
get('game-area').innerHTML = j.join('');
j = 0;

/*setup settings, get values from localStorage if they are set*/
get('audio-volume').value = ls.getItem('match0')===null ? 1 : parseFloat(ls.getItem('match0'));
get('max-time').value = ls.getItem('match1')===null ? 0 : parseInt(ls.getItem('match1'));
get('y-margin').value = ls.getItem('match2')===null ? 0 : parseInt(ls.getItem('match2'));
get('display-select').value = ls.getItem('match3')===null ? 1 : 0;

/*set value of start-key if saved into localStorage*/
if(ls.getItem('match4')===null){
    get('start-key').value = 'H'
}else{
    get('start-key').value = ls.getItem('match4');
    get('start-button').value = 'Start ('+ls.getItem('match4')+')'
}

/*set y margin of table based on settings*/
get('lol-a-table').style.marginTop = get('y-margin').value+'px';

window.onkeydown = function(e){
    i = window.event ? event : e;
    i = i.charCode ? i.charCode : i.keyCode;
    if(String.fromCharCode(i)===get('start-key').value){
        stop();
        start()
    }else if(i===27){/*ESC*/
        stop()
    }
}
