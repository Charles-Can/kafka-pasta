import inquirer from 'inquirer';
import chalk from 'chalk';

const Question = function(type, name, message, def, validate, when)  {
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
  }
}

const questions = [
  new Question(
    `input`,
    `kafkaHost`,
    `What is the source kafka instance?`
  ),
  new Question(
    `input`, 
    `topicName`,
    `What is the name of the topic you wish to copy?`,
  ),
  new Question(
    `confirm`, 
    `confirmSettings`,
    `Are these the correct kafka settings?`,
    (answers) => Object.keys(answers).map( k => console.log(`${chalk.magenta(k)} : ${chalk.yellow(answers[k])} `))
  ),
];

export class KafkaSettings {

  constructor(doGreet=true) {
    this.host;
    this.topic;
    this.questions = questions;
  }

  prompt(doGreet = true) {
    if(doGreet) {
      return this.greet()
        .then(this.inquireAboutKafka.bind(this))
        .then(this.storeAnswers.bind(this))
        .catch(console.log);
    }
      return this.inquireAboutKafka()
        .then(this.storeAnswers.bind(this))
        .catch(console.log);
  }

  storeAnswers(answers) {
    if(answers && answers.confirmSettings) {
      return {
        host: answers.kafkaHost,
        topic: answers.topicName
      };
    } else {
      console.log(chalk.red(`Oops, let's try that again. \n\n`))
      return this.prompt(false);
    }
  }

  inquireAboutKafka() {
    return inquirer.prompt(this.questions);
  }

  greet() {
    return new Promise((resolve, reject) => {
      console.log(chalk.green(`Kafka info`));
      resolve();
    });
  }

}