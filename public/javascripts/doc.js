const roomId = window.location.pathname.slice(1); // get room id from the url
const navigator = window.navigator;
console.log(navigator);

let socket = new WebSocket("ws://localhost:4000");

socket.onopen = function(event) {
    console.log(event);
    socket.send(JSON.stringify({ type:"joinRoom", data:roomId }));
}

socket.onclose = function(event) {
    console.log(event.code);
    console.log(event.wasClean);
    //console.log(event.reason);
    /* if(event.code != 1001) {
        console.log(navigator.onLine);
        if(!navigator.onLine) {
            alert('You are offline. Connect to internet');
        }
    } */
    console.log('DISCONNECTED');
}


socket.onmessage = message => {
    console.log(message);
    msg = JSON.parse(message.data);

    if(msg.type == 'document') {
        let docText = document.getElementById('doc');
        docText.value = msg.data;
    }
}

//? send only the changes in the document ?

let timeout = null;
waitTime = 50;
textField = document.getElementById('doc');
textField.addEventListener('keyup', () => {
    // start a new timeout for every keystroke event
    clearTimeout(timeout);
    // a timer will start for every keystroke
    // if we get another keystroke before 500 ms, 
    //the listener will fire again and the timeout will be cleared
    // otherwise the textarea contents will be sent to the server for relay
    timeout = setTimeout(() => {
        /* if(navigator.onLine)
            socket.send(JSON.stringify({type: 'document', data: textField.value}));
        else
            alert('connect to the internet !!!'); */
        socket.send(JSON.stringify({type: 'document', data: textField.value}));
    }, waitTime); 

    
});


window.addEventListener('online', () => {
    console.log('online listener   ' + Date.now());
    console.log(navigator.onLine);
});
window.addEventListener('offline', () => {
    console.log('offine listener   ' + Date.now());
    console.log(navigator.onLine);
});


//* doesn't work
   /*  msg = JSON.stringify({type: 'document', data: textField.value});
    timeout = setTimeout(() => {
        socket.send(msg);
    }, waitTime); */