import { Logger } from "@mondaycom/apps-sdk";
import mongoose from "mongoose";

const logger = new Logger("MongoDBHealthService");

const HEALTH_CHECK_COLLECTION = "health_check";
const CONNECTION_TIMEOUT = 10000; // 10 seconds

/**
 * Checks MongoDB connectivity and ability to perform read/write operations
 * @returns {Promise<{isConnected: boolean, canWrite: boolean, canRead: boolean, details: object}>}
 */
export async function checkMongoDBHealth() {
  const connectionString = process.env.MNDY_MONGODB_CONNECTION_STRING;

  const result = {
    isConnected: false,
    canWrite: false,
    canRead: false,
    region: process.env.MNDY_REGION
      ? process.env.MNDY_REGION.toUpperCase()
      : "UNKNOWN",
    itemsInCollection: null,
    details: {
      connectionString: connectionString
        ? "***configured***"
        : "NOT_CONFIGURED",
      timestamp: new Date().toISOString(),
    },
  };

  if (!connectionString) {
    result.details.error =
      "MNDY_MONGODB_CONNECTION_STRING environment variable is not set";
    return result;
  }

  let connection = null;

  try {
    // Connect to MongoDB
    connection = await mongoose
      .createConnection(connectionString, {
        serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
        connectTimeoutMS: CONNECTION_TIMEOUT,
      })
      .asPromise();

    result.isConnected = true;
    result.details.readyState = connection.readyState;
    logger.info("MongoDB connection established");

    // Test write capability
    const testDoc = {
      _id: `health_check_${Date.now()}`,
      timestamp: new Date(),
      test: true,
    };

    try {
      const collection = connection.collection(HEALTH_CHECK_COLLECTION);
      await collection.insertOne(testDoc);
      result.canWrite = true;
      result.details.writeTest = "SUCCESS";
      logger.info("MongoDB write test passed");

      // Test read capability
      try {
        const readResult = await collection.findOne({ _id: testDoc._id });
        result.canRead = readResult !== null;
        result.details.readTest = result.canRead
          ? "SUCCESS"
          : "FAILED - Document not found";
        logger.info("MongoDB read test passed");

        // Cleanup - delete the test document
        await collection.deleteOne({ _id: testDoc._id });
        result.details.cleanup = "SUCCESS";

        // Add a persistent document (not deleted)
        const persistentDoc = {
          _id: `persistent_${Date.now()}`,
          timestamp: new Date(),
          region: result.region,
          persistent: true,
        };
        await collection.insertOne(persistentDoc);
        result.details.persistentDocAdded = persistentDoc._id;

        // Get number of items in collection
        result.itemsInCollection = await collection.countDocuments();
        result.details.itemsInCollection = result.itemsInCollection;
        logger.info(`Items in collection: ${result.itemsInCollection}`);
      } catch (readErr) {
        result.details.readTest = `FAILED - ${readErr.message}`;
        logger.error({ error: readErr.message }, "MongoDB read test failed");
      }
    } catch (writeErr) {
      result.details.writeTest = `FAILED - ${writeErr.message}`;
      logger.error({ error: writeErr.message }, "MongoDB write test failed");
    }
  } catch (connErr) {
    result.details.error = connErr.message;
    logger.error({ error: connErr.message }, "MongoDB connection failed");
  } finally {
    // Close the connection
    if (connection) {
      try {
        await connection.close();
        logger.info("MongoDB connection closed");
      } catch (closeErr) {
        logger.warn(
          { error: closeErr.message },
          "Error closing MongoDB connection"
        );
      }
    }
  }

  return result;
}
