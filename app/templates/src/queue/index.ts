import { Channel } from 'amqplib';
import * as amqp from 'amqplib';

const createRabbitMQChannel = async (rabbitmqURL: string) => {
  const connection = await amqp.connect(rabbitmqURL);
  const channel = await connection.createChannel();
  return channel;
};

export const assertAndConsumeFromQueue = (
  queueName: string,
  channel: amqp.Channel,
  handler: (payload: amqp.ConsumeMessage) => void,
  options: amqp.Options.Consume = { noAck: false },
) => {
  channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, handler, options);
};

export const assertAndSendToQueue = (
  queueName: string,
  channel: Channel,
  payload?: any,
) => {
  channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, new Buffer(JSON.stringify(payload)), {
    persistent: true,
  });
};

export default createRabbitMQChannel;
