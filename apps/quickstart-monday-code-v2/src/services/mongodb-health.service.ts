import { Logger } from "@mondaycom/apps-sdk";
import mongoose from "mongoose";

const logger = new Logger("MongoDBHealthService");

const HEALTH_CHECK_COLLECTION = "health_check";
const CONNECTION_TIMEOUT = 10000;

interface HealthResult {
  isConnected: boolean;
  canWrite: boolean;
  canRead: boolean;
  region: string;
  itemsInCollection: number | null;
  details: Record<string, unknown>;
}

export async function checkMongoDBHealth(): Promise<HealthResult> {
  const connectionString = process.env.MNDY_MONGODB_CONNECTION_STRING;

  const result: HealthResult = {
    isConnected: false,
    canWrite: false,
    canRead: false,
    region: process.env.MNDY_REGION ? process.env.MNDY_REGION.toUpperCase() : "UNKNOWN",
    itemsInCollection: null,
    details: {
      connectionString: connectionString ? "***configured***" : "NOT_CONFIGURED",
      timestamp: new Date().toISOString(),
    },
  };

  if (!connectionString) {
    result.details.error = "MNDY_MONGODB_CONNECTION_STRING environment variable is not set";
    return result;
  }

  let connection: mongoose.Connection | null = null;

  try {
    connection = await mongoose
      .createConnection(connectionString, {
        serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
        connectTimeoutMS: CONNECTION_TIMEOUT,
      })
      .asPromise();

    result.isConnected = true;
    result.details.readyState = connection.readyState;
    logger.info("MongoDB connection established");

    const testDocId = `health_check_${Date.now()}`;
    const testDoc = {
      _id: testDocId,
      timestamp: new Date(),
      test: true,
    };

    try {
      const collection = connection.collection(HEALTH_CHECK_COLLECTION);
      await collection.insertOne(testDoc as unknown as Record<string, unknown>);
      result.canWrite = true;
      result.details.writeTest = "SUCCESS";

      try {
        const readResult = await collection.findOne({ _id: testDocId as unknown as mongoose.mongo.BSON.ObjectId });
        result.canRead = readResult !== null;
        result.details.readTest = result.canRead ? "SUCCESS" : "FAILED - Document not found";

        await collection.deleteOne({ _id: testDocId as unknown as mongoose.mongo.BSON.ObjectId });
        result.details.cleanup = "SUCCESS";

        const persistentDocId = `persistent_${Date.now()}`;
        const persistentDoc = {
          _id: persistentDocId,
          timestamp: new Date(),
          region: result.region,
          persistent: true,
        };
        await collection.insertOne(persistentDoc as unknown as Record<string, unknown>);
        result.details.persistentDocAdded = persistentDocId;

        result.itemsInCollection = await collection.countDocuments();
        result.details.itemsInCollection = result.itemsInCollection;
      } catch (readErr) {
        result.details.readTest = `FAILED - ${(readErr as Error).message}`;
        logger.error(`MongoDB read test failed: ${(readErr as Error).message}`);
      }
    } catch (writeErr) {
      result.details.writeTest = `FAILED - ${(writeErr as Error).message}`;
      logger.error(`MongoDB write test failed: ${(writeErr as Error).message}`);
    }
  } catch (connErr) {
    result.details.error = (connErr as Error).message;
    logger.error(`MongoDB connection failed: ${(connErr as Error).message}`);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        logger.warn(`Error closing MongoDB connection: ${(closeErr as Error).message}`);
      }
    }
  }

  return result;
}
