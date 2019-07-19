import { assertAndSendToQueue } from '../index';
import { Channel } from 'amqplib';

const produceDummyProducer = (channel: Channel, payload?: any) => {
  assertAndSendToQueue('QUEUE_DUMMY', channel, payload);
};

export default produceDummyProducer;
