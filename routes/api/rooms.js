var express = require('express');
var router = express.Router();
const rooms = require('../../Rooms');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.json(rooms);
});

module.exports = router;