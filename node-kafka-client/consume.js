const Kafka = require("node-rdkafka"); // see: https://github.com/blizzard/node-rdkafka
const externalConfig = require('./config').config;

const CONSUMER_GROUP_ID = "node-consumer-2"
//  If you run the consumer application a second time, you will probably not see any messages - 
// or only new ones. This is the effect of using a Consumer Group Id. The Kafka Cluster retains the 
// Consumer Group Id and its corresponding offset. In the second run, the consuming applications joins 
// the same Consumer Group as before. This group has already consumed all messages. If you now change 
// the Consumer Group Id and run the Node application again, you will see all messages on the topic once more. 
// This is because for this new Consumer Group, no messages at all have been read from the topic, and Kafka
//  will offer up all messages from the beginning of time.

const kafkaConf = {
    "group.id": CONSUMER_GROUP_ID,
    "metadata.broker.list": externalConfig.KAFKA_BROKERS,
    "security.protocol": "SASL_SSL",
        "sasl.mechanisms": "SCRAM-SHA-256",
        "sasl.username": externalConfig.KAFKA_USER,
        "sasl.password": externalConfig.KAFKA_PASS,
        "socket.keepalive.enable": true,
        "debug": "generic,broker,security"
};

const topics = [externalConfig.KAFKA_TOPIC];

var stream = new Kafka.KafkaConsumer.createReadStream(kafkaConf, { "auto.offset.reset": "earliest" }, {
    topics: topics
});

stream.on('data', function (message) {
    console.log(`Consumed message on Stream: ${message.value.toString()}`);
    // the structure of the messages is as follows:
    //   {
    //     value: Buffer.from('hi'), // message contents as a Buffer
    //     size: 2, // size of the message, in bytes
    //     topic: 'librdtesting-01', // topic the message comes from
    //     offset: 1337, // offset the message was read from
    //     partition: 1, // partition the message was on
    //     key: 'someKey', // key of the message if present
    //     timestamp: 1510325354780 // timestamp of message creation
    //   }
});

console.log(`Stream consumer created to consume from topic ${topics}`);

stream.consumer.on("disconnected", function (arg) {
    console.log(`The stream consumer has been disconnected`)
    process.exit();
});

// automatically disconnect the consumer after 30 seconds
setTimeout(function () {
    stream.consumer.disconnect();
}, 30000)


