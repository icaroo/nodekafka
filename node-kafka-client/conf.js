const topic = "9cn3c9jo-topic_1"; // set the correct topic name, especially when you are using CloudKarafka
 
const kafkaConfig = {
    // Specify the endpoints of the CloudKarafka Servers for your instance found under Connection Details on the Instance Details Page
    // this looks like this: moped-01.srvs.cloudkafka.com:9094,moped-02.srvs.cloudkafka.com:9094,moped-03.srvs.cloudkafka.com:9094"
    "metadata.broker.list": "rocket-01.srvs.cloudkafka.com:9094,rocket-02.srvs.cloudkafka.com:9094,rocket-03.srvs.cloudkafka.com:9094"
    , "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": "9cn3c9jo",
    "sasl.password": "4TmZcef2pLwCLgA0WBtwvrLw5JHdrtao" ,
    "socket.keepalive.enable": true,
    "debug": "generic,broker,security"
};
 
module.exports = { kafkaConfig, topic };