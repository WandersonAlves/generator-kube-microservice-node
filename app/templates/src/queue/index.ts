import { Channel } from 'amqplib';
import * as amqp from 'amqplib';

/**
 * Creates a RabbitMQ channel
 * @param rabbitmqURL RabbitMQ URL
 */
const createRabbitMQChannel = async (rabbitmqURL: string) => {
  const connection = await amqp.connect(rabbitmqURL);
  const channel = await connection.createChannel();
  return channel;
};
/**
 * Connects to a queue and consume all the messages by the @param handler
 *
 * I.e:
 *
 * ```typescript
 * constructor(@inject(REFERENCES.TenantModel) model: Model<Document>) {
 *   super(model, tenantSchema);
 *   this._setupRabbitMQChannel();
 * }
 *
 * private async _setupRabbitMQChannel() {
 *   this._channel = await createRabbitMQChannel(env.rabbitmq_url);
 * }
 * ```
 * @param queueName Queue Name
 * @param channel Channel object created by [[createRabbitMQChannel]]
 * @param handler A function that'll do the job
 * @param options RabbitMQ options
 */
export const assertAndConsumeFromQueue = (
  queueName: string,
  channel: amqp.Channel,
  handler: (payload: amqp.ConsumeMessage) => void,
  options: amqp.Options.Consume = { noAck: false },
) => {
  channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, handler, options);
};

/**
 * Connects to a queue and produce a message
 *
 * The message produced has `persistent: true` in their options
 * @param queueName Queue Name
 * @param channel Channel object created by [[createRabbitMQChannel]]
 * @param payload Any object
 */
export const assertAndSendToQueue = (queueName: string, channel: Channel, payload?: any) => {
  channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, new Buffer(JSON.stringify(payload)), {
    persistent: true,
  });
};

export default createRabbitMQChannel;
