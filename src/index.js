import { KafkaSettings } from './settings'; 
import chalk from 'chalk';


(function() {
  let kafkaSource;
  let kafkaDest;

  getSource()
    .then(src => kafkaSource = src)
    .then(getDestination)
    .then( dest => kafkaDest = dest)
    .then( () => console.log({ kafkaDest, kafkaSource }) )
    .catch(console.log);
})();

function getSource() {
  console.log(chalk.yellow(`========================================================`));
  console.log(chalk.yellow(`Source Kafka Settings...`));
  console.log(chalk.yellow(`========================================================`));  
  return new KafkaSettings().prompt()
    .then(validateTopic)
}

function getDestination() {
  console.log(chalk.yellow(`========================================================`));
  console.log(chalk.yellow(`Destination Kafka Settings...`));
  console.log(chalk.yellow(`========================================================`));
  return new KafkaSettings().prompt()
      .then(testConnection);
}

import { Client } from 'kafka-node';
import { get } from 'lodash';

function validateTopic(kafkaSource) {
  const client = new Client(kafkaSource.host);
  let topic;

  return new Promise((resolve, reject) => {
    client.once('connect', () => {
      client.loadMetadataForTopics([], function( err, results) {
        if(err) {
          throw err;
        }

        let topicFound = get(results, '1.metadata')[kafkaSource.topic];

        if(!topicFound) {
          reject(chalk.red(`\nThe topic was not found. Please re-enter the source kafka info.\n`));
        }
        console.log(chalk.bgGreen(`--- Kafka Settings valid ---`));
        console.log(chalk.green(`${kafkaSource.topic} found!`));
        resolve(kafkaSource);
      });
    });
    client.on('error', function() { reject(arguments) });
  })
  .catch( mess => {
    console.log(mess);
    return getSource();
  });
}

function testConnection(kafkaSettings) {
  return new Promise((resolve, reject) => {
    const client = new Client(settings.host);
    let time = 0;
    const wait = 40;
    const loader = [
      '/ ',
      '| ',
      '\\ ',
      '- '
    ].map( x => chalk.yellow(x) + chalk.green(' Validating Kafka connection'));
    const ui = new inquirer.ui.BottomBar({bottomBar: loader[time % 4]});
    const timer = setInterval(() => {
      time++;
      ui.updateBottomBar(loader[time % loader.length]);
      if(time > wait) {
        clearInterval(timer);
        reject( chalk.red(`\n Failed to connect to kafka instance at ${settings.host}, please ensure that this is correct.`));
      }
    }, 250);

    client.on('connect', () => {
      clearInterval(timer);
      client.close();
      resolve(settings);
    });

  });
}