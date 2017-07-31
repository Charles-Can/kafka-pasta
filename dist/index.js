'use strict';

var _settings = require('./settings');

(function () {
  var kafkaSource = void 0;
  var kafkaDest = void 0;

  new _settings.KafkaSettings().prompt().then(function (src) {
    kafkaSource = src;
    return new _settings.KafkaSettings().prompt();
  }).then(function (dest) {
    kafkaDest = dest;
  }).then(function () {
    return console.log({ kafkaDest: kafkaDest, kafkaSource: kafkaSource });
  }).catch(console.log);
})();