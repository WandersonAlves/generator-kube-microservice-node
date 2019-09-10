import { Channel, ConsumeMessage } from 'amqplib';
import { assertAndConsumeFromQueue } from '../index';

export const consumeDummyQueue = (
  channel: Channel,
  handler: (payload: ConsumeMessage) => void,
) => {
  assertAndConsumeFromQueue('QUEUE_DUMMY', channel, handler);
};
