var websocket, notifNum=0;
var messages = document.getElementById('messages');
function go(cli) {
    console.log(cli);
    if (websocket != null) {
        websocket.close();
    }
    console.log('wss://stream.pushbullet.com/websocket/' + cli);
    websocket = new WebSocket('wss://stream.pushbullet.com/websocket/' + cli);
    websocket.onopen = function(e) {
        //messages.innerHTML += "<p>WebSocket onopen</p>";
    };
    websocket.onmessage = function(e) {
        console.log(e.data);
        var data = JSON.parse(e.data), type = ""+data.type, mess="";
        if(type!="nop"){
            if(type=="push"){
                var push = data.push, pushType = push.type;
                if((""+pushType)=="mirror"){
                    var pushBody = push.body, pushApp = push.application_name;
                    mess = pushApp+" : "+pushBody;
                }
                else {
                    mess = (""+pushType).toLocaleUpperCase();
                }
            }
            else if(type=="tickle"){
                var subtype = ""+data.subtype;
                if(subtype=="push"){
                    mess = "Push resource changed!";
                }
                else{
                    mess = "Device resource changed!";
                }
            }
            if(notifNum>3){
                messages.innerHTML='Your Pushbullet Notifications : '+messages.innerHTML.slice(messages.innerHTML.indexOf("</p>")+4);
                console.log(messages.innerHTML.slice(messages.innerHTML.indexOf("</p>")+4));
            }
            if(mess!="")
            messages.innerHTML += "<p>" +mess+ " " +"</p>";
            console.log(messages);
            notifNum++;
        }
    };
    websocket.onerror = function(e) {
        //messages.innerHTML += "<p>WebSocket onerror</p>";
    };
    websocket.onclose = function(e) {
        //messages.innerHTML += "<p>WebSocket onclose</p>";
    };
}
go(document.currentScript.getAttribute('cli'));