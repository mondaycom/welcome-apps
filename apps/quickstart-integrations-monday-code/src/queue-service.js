import { Logger, Queue } from "@mondaycom/apps-sdk";

const queue = new Queue();
const logger = new Logger("QueueService");


export const produceMessage = async (message) => {
    logger.info({ message }, `produce message received`);
    const messageId = await queue.publishMessage(message);
    logger.info({ messageId }, `Message published.`);
    return messageId;
}

export const readQueueMessage = ({ body, query }) => {
    const envMessageSecret = process.env.MNDY_TOPIC_MESSAGES_SECRET;
    logger.info({ envMessageSecret }, `expected queue secret value`)
    logger.info({ body: JSON.stringify(body) }, `queue message received body`)
    logger.info({ query: JSON.stringify(query) }, `queue message query params`)
    if (!queue.validateMessageSecret(query.secret))  {
        logger.info("Queue message received is not valid, since secret is not matched, this message could come from an attacker.");
        throw new Error('not allowed');
    }
    logger.info("Queue message received successfully.");
    // process the queue message payload...
};
