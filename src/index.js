import { KafkaSettings } from './settings'; 



(function() {
  let kafkaSource;
  let kafkaDest;

  new KafkaSettings().prompt()
    .then( src => {
      kafkaSource = src;
      return new KafkaSettings().prompt();
    })  
    .then( dest => {
      kafkaDest = dest;
    })
    .then( () => console.log({ kafkaDest, kafkaSource }) )
    .catch(console.log)

})();