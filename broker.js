const client = require("redis").createClient();

module.exports = function () {
  const requeue = (message) => {
    const id = message.messageId;
    const m  = JSON.stringify(message);

    client.exists(['active', id], function(err, reply) {
      if (reply == 1) {
        client.lpush(['queue', m], function(err, reply) {
          client.del(['active', id], function(err, reply) {});
        });
      }
    });
  }

  client.monitor(function (err, res) {
    console.log("Starting Broker...");
  });

  client.on("monitor", function (time, args, raw_reply) {
    console.log(time + " | " + args);

    if (args.length >= 3 && args[0] == 'lpush' && args[1] == 'active') {
      setTimeout(function() {
        const message = JSON.parse(args[2]);

        requeue(message);
      }, 15000);
    }
  });
}