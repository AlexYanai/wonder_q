# WonderQ

WonderQ is a simple queueing system that allows for parallel reads and writes from multiple producers and consumers.

A producer should be able to add a message at any time and receive a message id in return, and a consumer should be able to poll the message broker for new messages and receive either a new message id or a message that there are no available message.

A consumer with a message id should be able to acknowledge receiving a message. A user should be able to get a general count of how many messages are still available or are currently being processed.

## Requirements

[Node.js](https://nodejs.org/en/)
[Redis](https://redis.io/topics/quickstart)

## Up and Running

1. Start the Redis server: `redis-server`
2. Start the app server: `npm start`

## Usage

#### `GET/info`
Returns an object `{'queue': int, 'active': int}` containing counts of the queued and active messages.

#### `POST/add [message]`
Takes a JSON object `{"message": ""}` and adds it to the queue. Returns an object `{"messageId": id}` upon success.

#### `GET/receive`
Moves a message from the queue to the active queue. Returns an object `{"messageId": id}` upon success. If the consumer does not consume the message it is returned to the front of the queue for later processing.

#### `DELETE/acknowledge [messageId]`
Takes a JSON object `{"messageId": "idk"}` containing the id of message to be deleted. A consumer acknowledges it's consumed the the message by deleting it from the active queue before it reverts beack to the main queue.

## Tests

WonderQ uses `Mocha` and `Chai` for testing.

**Run the tests**: `npm test`

## Scaling and Future
This is a very simple implementation of a message broker; it is effective and relatively performant within the scope of the project but is fairly inflexible.

There are only 2 possible queues that are created, _queue_ and _active_; in practice, having all consumers read from the same 1 queue would quickly reach a bottleneck.

The system by which messages are _requeued_ is very simple and artbitrary: a 15 second timeout from when the message enters the _active_ queue. While this strategy succeeds at the main goal of the second queue (making sure 2 consumers don't try and process the same 1 message and making sure failed reads are still eventually processed) it isn't particularly efficient; messages are _requeued_ at the front of the queue, meaning they'll be the last ones processed, which may (or may not) be important.

Using Redis would allow this system to be scaled to a fair degree. Redis' support for master-slave replication would be well suited for a system such as this that is heavy on reads. Redis clustering means that the system could be scaled horizontally, overcoming another potential limitation: the limited memory on a given local machine.

## TODO

* Expand test coverage
* Add front end for better visualization
* Add more flexibility with queue creation

## License

Copyright (c) 2018 Alex Yanai. Released under the [MIT License](http://opensource.org/licenses/MIT).