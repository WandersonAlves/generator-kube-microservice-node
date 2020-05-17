import * as amqp from 'amqplib';
import * as fs from 'fs';
import { Channel } from 'amqplib';
import { EventEmitter } from 'events';
import { logger } from '../shared/utils/logger';
import injectionContainer from '../config/inversify.config';
import REFERENCES from '../config/inversify.references';

/**
 * Creates a RabbitMQ channel
 * @param rabbitmqURL RabbitMQ URL
 */
const createRabbitMQChannel = async (rabbitmqURL: string) => {
  try {
    const connection = await amqp.connect(`${rabbitmqURL}?heartbeat=50`, {
      ca: [process.env.NODE_ENV === 'production' ? fs.readFileSync('./rabbitmq.cert') : null],
    });

    logger.info.apply(logger, ['Connection Succefful', { label: 'AMQP' }]);

    connection.on('error', err => {
      logger.error(err, { label: 'AMQP' });
    });

    connection.on('close', () => {
      logger.error('Channel closed, reconnecting...', { label: 'AMQP' });
      const eventBus = injectionContainer.get<EventEmitter>(REFERENCES.EventBus);
      eventBus.emit('reconnectRabbitMQ', true);
    });

    const channel = await connection.createChannel();
    return channel;
  } catch (e) {
    logger.error(e, { label: 'AMQP' });
    process.exit(1);
  }
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
) => {
  channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, handler, { noAck: false });
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
