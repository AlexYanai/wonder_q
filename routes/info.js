const express = require('express');
const router  = express.Router();
const rclient  = require('../store/client');
const {promisify} = require('util');

router.get('/', function(req, res, next) {
	const client = rclient();
	const len = promisify(client.llen).bind(client);

	Promise.all([len('queue'), len('active')]).then(function(reply) {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({'queue': reply[0], 'active': reply[1]});

		client.quit();
	});
});

module.exports = router;