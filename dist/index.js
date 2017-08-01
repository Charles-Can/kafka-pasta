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

  getSource().then(function (src) {
    return kafkaSource = src;
  }).then(getDestination).then(function (dest) {
    return kafkaDest = dest;
  }).then(function () {
    return console.log({ kafkaDest: kafkaDest, kafkaSource: kafkaSource });
  }).catch(console.log);
})();

function getSource() {
  console.log(_chalk2.default.yellow('========================================================'));
  console.log(_chalk2.default.yellow('Source Kafka Settings...'));
  console.log(_chalk2.default.yellow('========================================================'));
  return new _settings.KafkaSettings().prompt().then(validateTopic);
}

function getDestination() {
  console.log(_chalk2.default.yellow('========================================================'));
  console.log(_chalk2.default.yellow('Destination Kafka Settings...'));
  console.log(_chalk2.default.yellow('========================================================'));
  return new _settings.KafkaSettings().prompt().then(testConnection);
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
    client.on('error', function () {
      reject(arguments);
    });
  }).catch(function (mess) {
    console.log(mess);
    return getSource();
  });
}

function testConnection(kafkaSettings) {
  return new Promise(function (resolve, reject) {
    var client = new _kafkaNode.Client(settings.host);
    var time = 0;
    var wait = 40;
    var loader = ['/ ', '| ', '\\ ', '- '].map(function (x) {
      return _chalk2.default.yellow(x) + _chalk2.default.green(' Validating Kafka connection');
    });
    var ui = new inquirer.ui.BottomBar({ bottomBar: loader[time % 4] });
    var timer = setInterval(function () {
      time++;
      ui.updateBottomBar(loader[time % loader.length]);
      if (time > wait) {
        clearInterval(timer);
        reject(_chalk2.default.red('\n Failed to connect to kafka instance at ' + settings.host + ', please ensure that this is correct.'));
      }
    }, 250);

    client.on('connect', function () {
      clearInterval(timer);
      client.close();
      resolve(settings);
    });
  });
}