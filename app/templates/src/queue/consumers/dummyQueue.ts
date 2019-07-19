import { Channel, ConsumeMessage } from 'amqplib';
import { assertAndConsumeFromQueue } from '../index';

const consumeDummyQueue = (
  channel: Channel,
  handler: (payload: ConsumeMessage) => void,
) => {
  assertAndConsumeFromQueue('QUEUE_DUMMY', channel, handler);
};

export default consumeDummyQueue;
