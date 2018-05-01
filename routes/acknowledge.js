const express = require('express');
const router  = express.Router();
const rclient  = require('../store/client');
const {promisify} = require('util');

router.delete('/', function(req, res, next) {
	const client = rclient();
	const body = req['body'];
	const id = body['messageId'];

	client.exists(['active', id], function(err, reply) {
		if (err) {
			throw err;
		} else if (reply == 1) {
			client.del(['active', id], function(err, reply) {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({'status': 'OK', 'messageId': id});
			});
		} else {
			res.statusCode = 404;
			res.setHeader('Content-Type', 'application/json');
			res.json({'error': 'Message ID does not exist.'});
		}
	});
});

module.exports = router;