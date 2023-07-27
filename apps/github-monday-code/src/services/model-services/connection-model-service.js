import ConnectionStorage from '../../storage/connection-storage.js';
import logger from '../logger/index.js';

const connectionSecureStorage = new ConnectionStorage();
const TAG = 'connection_model_service';

/**
 * Retrieve a Github connection based on a monday user ID.
 * @returns A Github OAuth token associated with the user.
 */
export const getConnectionByUserId = async (userId) => {
  try {
    const response = await connectionSecureStorage.get(userId);
    return response;
  } catch (err) {
    logger.error('Failed to retrieve connection by user ID', TAG, { userId, error: err });
  }
};

/**
 * Create a Connection record in the DB.
 * A connection defines a relation between a monday user and their Github credentials.
 */
export const createConnection = async (attributes) => {
  const { userId, token } = attributes;
  try {
    const response = await connectionSecureStorage.set(userId, { userId, token });

    if (!response) {
      throw new Error('Failed to create connection');
    }

    return { userId, token };
  } catch (err) {
    logger.error('Failed to create connection', TAG, { userId, error: err });
  }
};

/**
 * Update an existing Connection.
 */
export const updateConnection = async (updates) => {
  const { userId, token } = updates;
  try {
    const response = await connectionSecureStorage.set(userId, { userId, token });

    if (!response) {
      throw new Error('Failed to update connection');
    }

    return { userId, token };
  } catch (err) {
    logger.error('Failed to update connection', TAG, { userId, error: err });
  }
};

/**
 * Delete a connection.
 */
export const deleteConnection = async (userId) => {
  try {
    await connectionSecureStorage.delete(userId);
    return key;
  } catch (err) {
    logger.error('Failed to delete connection', TAG, { userId, error: err });
  }
};
