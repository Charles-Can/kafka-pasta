import { KafkaSettings } from './settings'; 
import chalk from 'chalk';


(function() {
  let kafkaSource;
  let kafkaDest;

  console.log(chalk.yellow(`========================================================`));
  console.log(chalk.yellow(`Source Kafka Settings...`));
  console.log(chalk.yellow(`========================================================`));

  getSource()
    .then(src => kafkaSource = src)
    .then(getDestination)  
    .then( dest => {
      kafkaDest = dest;
    })
    .then( () => console.log({ kafkaDest, kafkaSource }) )
    .catch(console.log)

})();

function getSource() {
  return new KafkaSettings().prompt()
    .then(validateTopic)
}

function getDestination() {
  console.log(chalk.yellow(`========================================================`));
  console.log(chalk.yellow(`Destination Kafka Settings...`));
  console.log(chalk.yellow(`========================================================`));

  return new KafkaSettings().prompt();
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
  })
  .catch( mess => {
    console.log(mess);
    return getSource();
  });
}