
function setup() {
    let canvas = createCanvas(1200,400);
    canvas.position((windowWidth-width)/2,(windowHeight-height)/2);
    background('#000');
    socket = new WebSocket('ws://localhost:4000');
    socket.onmessage = function(message) {
        msg = JSON.parse(message.data);
        if(msg.type == 'canvas') {
            draw(msg.data);
        }
    }
}

function mouseDragged() {
	console.log(mouseX + ',' + mouseY);
	let data = {
		x: mouseX,
		y: mouseY,
		c: document.getElementById('c1').value,
		//size: slider.value()
	}
	socket.send(JSON.stringify({type:'canvas', data:data}));
	noStroke();
	//fill(document.getElementById('c1').value);
	ellipse(mouseX, mouseY, 10);

}

function draw(pos,fill) {
	noStroke();
	fill(0,255,0);
	ellipse(pos.x,pos.y,30,30);
}