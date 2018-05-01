const express = require('express');
const router  = express.Router();
const rclient  = require('../store/client');
const {promisify} = require('util');
const uuidv4 = require('uuid/v4');

router.post('/', function(req, res, next) {
	const client = rclient();
	const id = uuidv4();
	const message = JSON.stringify({'message': req['message'], 'messageId': id});

	client.lpush(['queue', message], function(err, reply) {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({'status': 'OK', 'messageId': id});

		client.quit();
	});
});

module.exports = router;