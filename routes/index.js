const express = require('express');
const router = express.Router();
const rooms = require('../Rooms');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/:roomId', (req, res) => {
	//if room not found
	res.render('combined');
})

router.post('/', (req, res) => {

	roomType = req.body.roomType;
	roomId = req.body.roomId;

	if(roomType === "newRoom") {
		rooms.push({
			id		: roomId, 
			clients	: [], 
			data	: ""
		});
		return res.redirect(`${roomId}`);
	}

	if(roomType === "joinRoom") {
		let found = rooms.find(room => room.id === roomId);
		if(found) {
			res.redirect(`/${roomId}`);
		} else {
			res.send(`room ${roomId} not found`);
		}
	}
});


module.exports = router;


