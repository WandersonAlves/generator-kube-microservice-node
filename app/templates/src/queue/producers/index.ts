import { assertAndSendToQueue } from '../index';
import { Channel } from 'amqplib';

export const produceDummyProducer = (channel: Channel, payload?: any) => {
  assertAndSendToQueue('QUEUE_DUMMY', channel, payload);
};
