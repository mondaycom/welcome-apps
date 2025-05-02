import { Logger } from "@mondaycom/apps-sdk";

class MessageQueue {
    publishMessage(message) {
        // Implement message queue logic
        return Promise.resolve(`mocked-message-id-${Date.now()}`);
    }

    validateMessageSecret(secret) {
        // Implement secret validation logic
        return secret === process.env.MNDY_TOPIC_MESSAGES_SECRET;
    }
}

const queue = new MessageQueue();
const logger = new Logger("QueueService");

export const produceMessage = async (message) => {
    logger.info(`Producing message: ${message}`);
    const messageId = await queue.publishMessage(message);
    logger.info(`Message published with ID: ${messageId}`);
    return messageId;
};

export const readQueueMessage = ({ body, query }) => {
    const envMessageSecret = process.env.MNDY_TOPIC_MESSAGES_SECRET;

    logger.info(`Expected queue secret: ${envMessageSecret}`);
    logger.info(`Received queue message body: ${JSON.stringify(body)}`);
    logger.info(`Received queue message query params: ${JSON.stringify(query)}`);

    if (!queue.validateMessageSecret(query.secret)) {
        logger.warn("Invalid queue message detected—possible attacker attempt.");
        throw new Error("Not allowed");
    }

    logger.info("Queue message successfully received.");
    // Process the queue message payload...
};
