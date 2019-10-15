const roomId = window.location.pathname.slice(1); // get room id from the url
const navigator = window.navigator;


function setup() {
    connect();
    let canvas = createCanvas(1200,400);
    //canvas.position((windowWidth-width)/2,(windowHeight-height)/2);
    background(0);
}

function connect() {
    socket = new WebSocket("ws://localhost:4000");

    socket.onopen = function(event) {
        console.log(event);
        socket.send(JSON.stringify({ type:"joinRoom", data:roomId }));
    }

    socket.onclose = function(event) {
        console.log(event.code);
        console.log(event.wasClean);
        //console.log(event.reason);
        if(event.code != 1001) {
            console.log(navigator.onLine);
            if(!navigator.onLine) {
                alert('You are offline. Connect to internet');
            }
        }
        console.log('DISCONNECTED');
    }

    socket.onmessage = message => {
        console.log(message);
        msg = JSON.parse(message.data);
    
        if(msg.type == 'document') {
            let docText = document.getElementById('doc');
            docText.value = msg.data;
        }
        if(msg.type == 'canvas') {
            draw(msg.data);
        }
    }
}

//? send only the changes in the document ?

let timeout = null;
waitTime = 500;
textField = document.getElementById('doc');
textField.addEventListener('keyup', () => {
    // start a new timeout for every keystroke event
    clearTimeout(timeout);
    // a timer will start for every keystroke
    // if we get another keystroke before 500 ms, 
    //the listener will fire again and the timeout will be cleared
    // otherwise the textarea contents will be sent to the server for relay
    if(navigator.onLine) {
        timeout = setTimeout(() => {
            socket.send(JSON.stringify({type: 'document', data: textField.value}));
        }, waitTime); 
    }
});


function mouseDragged() {
	console.log(mouseX + ',' + mouseY);
	let data = {
		x: mouseX,
		y: mouseY,
		//c: document.getElementById('c1').value,
		//size: slider.value()
    }
    if(navigator.onLine)
        socket.send(JSON.stringify({type:'canvas', data:data}));
    
	noStroke();
    //fill(document.getElementById('c1').value);
    fill(255);
	ellipse(mouseX, mouseY, 20);

}

function draw(data) {
	noStroke();
	fill(0,255,0);
	ellipse(data.x,data.y,20);
}

window.addEventListener('online', () => {
    console.log('online listener   ' + Date.now());
    console.log(navigator.onLine);
    network = document.getElementById('network');
    network.classList.remove('offline');
    network.classList.add('online')
    document.getElementById('network').innerHTML = 'Online';
});

window.addEventListener('offline', () => {
    // alert user about network
    alert('connect to the internet, changes not being sent !!')
    console.log('offine listener  ' + Date.now());
    network = document.getElementById('network');
    network.classList.remove('online');
    network.classList.add('offline')
    document.getElementById('network').innerHTML = 'Offline';
    
});

//* doesn't work
   /*  msg = JSON.stringify({type: 'document', data: textField.value});
    timeout = setTimeout(() => {
        socket.send(msg);
    }, waitTime); */