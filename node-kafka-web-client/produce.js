const Kafka = require("node-rdkafka");
// read the KAFKA Brokers and KAFKA_TOPIC values from the local file config.js
const externalConfig = require('./config').config;

const PRODUCER_GROUP_ID = "node-producer" 

let messageCounter = 1;


// construct a Kafka Configuration object understood by the node-rdkafka library
const kafkaConf = {
    "group.id": PRODUCER_GROUP_ID,
      // Specify the endpoints of the CloudKarafka Servers for your instance found under Connection Details on the Instance Details Page
    "metadata.broker.list": externalConfig.KAFKA_BROKERS,
    "security.protocol": "SASL_SSL",
        "sasl.mechanisms": "SCRAM-SHA-256",
        "sasl.username": externalConfig.KAFKA_USER,
        "sasl.password": externalConfig.KAFKA_PASS,
        "socket.keepalive.enable": true,
        "debug": "generic,broker,security"
};




const topic = externalConfig.KAFKA_TOPIC;
// create a Kafka Producer - connected to the KAFKA_BROKERS defined in config.js
const producer = new Kafka.Producer(kafkaConf);
prepareProducer(producer)

const produceMessage = function (message) {
    console.log(`Produce message ${message}`)
    producer.produce(topic, -1, new Buffer.from(message), messageCounter++);
}

// initialize the connection of the Producer to the Kafka Cluster
producer.connect();



function prepareProducer(producer) {
    // event handler attached to the Kafka Producer to handle the ready event that is emitted when the Producer has connected sucessfully to the Kafka Cluster
    producer.on("ready", function (arg) {
        console.log(`Producer connection to Kafka Cluster is ready`)
    });

    producer.on("disconnected", function (arg) {
        process.exit();
    });

    producer.on('event.error', function (err) {
        console.error(err);
        process.exit(1);
    });
    // This event handler is triggered whenever the event.log event is emitted, which is quite often
    producer.on('event.log', function (log) {
        // uncomment the next line if you want to see a log message every step of the way
        //console.log(log);
    });
}


module.exports = {  produceMessage };