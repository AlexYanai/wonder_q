const express = require('express');
const router  = express.Router();
const rclient  = require('../store/client');
const {promisify} = require('util');

router.get('/', function(req, res, next) {
	const client = rclient();

	client.brpop('queue', 2, function(err, reply) {
		if (reply == null) {
			res.statusCode = 404;
			res.setHeader('Content-Type', 'application/json');
			res.json({'error': 'Queue is empty...'});

			client.quit();
		} else {
			const message = JSON.parse(reply[1]);

			client.lpush(['active', JSON.stringify(message)], function(err, reply) {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({'messageId': message['messageId']});

				client.quit();
			});
		}
	});
});

module.exports = router;