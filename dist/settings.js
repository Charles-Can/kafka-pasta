'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KafkaSettings = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Question = function Question(type, name, message, def, validate, when) {
  this.type = type;
  this.name = name;
  this.message = message;
  this.default = def;
  this.validate = validate;
  this.when = when;

  return {
    type: this.type,
    name: this.name,
    message: this.message + '\n',
    default: def,
    validate: this.validate,
    when: this.when
  };
};

var questions = [new Question('input', 'kafkaHost', 'What is the source kafka instance?'), new Question('input', 'topicName', 'What is the name of the topic you wish to copy?'), new Question('confirm', 'confirmSettings', 'Are these the correct kafka settings?', function (answers) {
  return Object.keys(answers).map(function (k) {
    return console.log(_chalk2.default.magenta(k) + ' : ' + _chalk2.default.yellow(answers[k]) + ' ');
  });
})];

var KafkaSettings = exports.KafkaSettings = function () {
  function KafkaSettings() {
    var doGreet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    _classCallCheck(this, KafkaSettings);

    this.host;
    this.topic;
    this.questions = questions;
  }

  _createClass(KafkaSettings, [{
    key: 'prompt',
    value: function prompt() {
      var doGreet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (doGreet) {
        return this.greet().then(this.inquireAboutKafka.bind(this)).then(this.storeAnswers.bind(this)).catch(console.log);
      }
      return this.inquireAboutKafka().then(this.storeAnswers.bind(this)).catch(console.log);
    }
  }, {
    key: 'storeAnswers',
    value: function storeAnswers(answers) {
      if (answers && answers.confirmSettings) {
        return {
          host: answers.kafkaHost,
          topic: answers.topicName
        };
      } else {
        console.log(_chalk2.default.red('Oops, let\'s try that again. \n\n'));
        return this.prompt(false);
      }
    }
  }, {
    key: 'inquireAboutKafka',
    value: function inquireAboutKafka() {
      return _inquirer2.default.prompt(this.questions);
    }
  }, {
    key: 'greet',
    value: function greet() {
      return new Promise(function (resolve, reject) {
        console.log(_chalk2.default.green('Kafka info'));
        resolve();
      });
    }
  }]);

  return KafkaSettings;
}();