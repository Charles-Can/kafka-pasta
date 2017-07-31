'use strict';

var _settings = require('./settings');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _kafkaNode = require('kafka-node');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var kafkaSource = void 0;
  var kafkaDest = void 0;

  console.log(_chalk2.default.yellow('========================================================'));
  console.log(_chalk2.default.yellow('Source Kafka Settings...'));
  console.log(_chalk2.default.yellow('========================================================'));

  getSource().then(function (src) {
    return kafkaSource = src;
  }).then(getDestination).then(function (dest) {
    kafkaDest = dest;
  }).then(function () {
    return console.log({ kafkaDest: kafkaDest, kafkaSource: kafkaSource });
  }).catch(console.log);
})();

function getSource() {
  return new _settings.KafkaSettings().prompt().then(validateTopic);
}

function getDestination() {
  console.log(_chalk2.default.yellow('========================================================'));
  console.log(_chalk2.default.yellow('Destination Kafka Settings...'));
  console.log(_chalk2.default.yellow('========================================================'));

  return new _settings.KafkaSettings().prompt();
}

function validateTopic(kafkaSource) {
  var client = new _kafkaNode.Client(kafkaSource.host);
  var topic = void 0;

  return new Promise(function (resolve, reject) {
    client.once('connect', function () {
      client.loadMetadataForTopics([], function (err, results) {
        if (err) {
          throw err;
        }

        var topicFound = (0, _lodash.get)(results, '1.metadata')[kafkaSource.topic];

        if (!topicFound) {
          reject(_chalk2.default.red('\nThe topic was not found. Please re-enter the source kafka info.\n'));
        }
        console.log(_chalk2.default.bgGreen('--- Kafka Settings valid ---'));
        console.log(_chalk2.default.green(kafkaSource.topic + ' found!'));
        resolve(kafkaSource);
      });
    });
  }).catch(function (mess) {
    console.log(mess);
    return getSource();
  });
}