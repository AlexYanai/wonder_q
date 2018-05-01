module.exports = function () {
	const redis = require('redis');
	const client = redis.createClient();

	return client;
}