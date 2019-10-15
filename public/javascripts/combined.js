let socket;

const roomId = window.location.pathname.slice(1);
const navigator = window.navigator;
//console.log(navigator);

socket = new WebSocket('ws://localhost:4000');

socket.onopen = function(event) {
    console.log(event);
    socket.send(JSON.stringify({ type:"joinRoom", data:roomId }));
}

socket.onclose = function(event) {
    console.log('CloseEvent code: ', event.code);
    console.log('CloseEvent wasClean: ', event.wasClean);
    console.log('CloseEvent reason: ', event.reason);
    /* if(event.code != 1001) {
        console.log(navigator.onLine);
        if(!navigator.onLine) {
            alert('You are offline. Connect to internet');
        }
    } */
    console.log('DISCONNECTED');
}


window.addEventListener('online', () => {
    console.log('online listener   ' + Date.now());
    console.log(navigator.onLine);
});
window.addEventListener('offline', () => {
    console.log('offine listener   ' + Date.now());
    console.log(navigator.onLine);
});

module.exports = socket;