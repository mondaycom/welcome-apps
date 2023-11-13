import { Logger } from "@mondaycom/apps-sdk";
import { PubSub } from "@google-cloud/pubsub";
const pubSubClient = new PubSub();

const logTag = "QueueService";
const logger = new Logger(logTag);


export const produceMessage = async ({ body }) => {
    const topicName = process.env.MNDY_TOPIC_NAME
    logger.info(`produce message received ${JSON.stringify(body)}`);
    logger.info(`about to publish to topic "${topicName}"`);
    const dataBuffer = Buffer.from(JSON.stringify(body));
    const messageId = await pubSubClient
        .topic(topicName)
        .publishMessage({ data: dataBuffer, attributes: { "Content-Type": "application/json" } });
    logger.info(`Message ${messageId} published.`);
    return messageId;
}

export const readQueueMessage = ({ body, query }) => {
    const topicMessageSecret = process.env.MNDY_TOPIC_MESSAGES_SECRET
    const receivedSecret = query.secret;
    logger.info(`queue message topic Message Secret: "${topicMessageSecret}"`)
    logger.info(`queue message received body ${JSON.stringify(body)}`)
    logger.info(`queue message query params ${JSON.stringify(query)}`)
    if (receivedSecret === topicMessageSecret)  {
        logger.info("Queue message source validation completed successfully secret is matched., this message come from an MCODE system.");
    }
    else {
        logger.info("Queue message received is not valid, since secret is not matched, this message could come from an attacker.");
    }
};
