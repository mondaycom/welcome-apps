import { Logger, Queue } from "@mondaycom/apps-sdk";

const queue = new Queue();
const logger = new Logger("QueueService");

export const produceMessage = async (message: string): Promise<string> => {
  logger.info(`produce message received: ${message}`);
  const messageId = await queue.publishMessage(message);
  logger.info(`Message published: ${messageId}`);
  return messageId;
};

export const produceMessageWithPayload = async (body?: Record<string, unknown>): Promise<string> => {
  let payload = body;
  if (!payload || typeof payload !== "object" || Object.keys(payload).length === 0) {
    payload = {
      message: "This is an auto generated body because we got null",
      date: new Date().toISOString(),
      bool: true,
    };
  }
  const message = JSON.stringify(payload);
  return await produceMessage(message);
};

export const readQueueMessage = ({ body, query }: { body: unknown; query: Record<string, string> }): void => {
  const envMessageSecret = process.env.MNDY_TOPIC_MESSAGES_SECRET;
  logger.info(`expected queue secret value: ${envMessageSecret}`);
  logger.info(`queue message received body: ${JSON.stringify(body)}`);
  logger.info(`queue message query params: ${JSON.stringify(query)}`);
  if (!queue.validateMessageSecret(query.secret)) {
    logger.info("Queue message received is not valid, since secret is not matched.");
    throw new Error("not allowed");
  }
  logger.info("Queue message received successfully.");
};
