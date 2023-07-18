import { SecureStorage } from '@mondaycom/apps-sdk';
import { getConnectionKey } from './key-service.js';

/**
 * Retrieve a Github connection based on a monday user ID.
 * @returns A Github OAuth token associated with the user.
 */
export const getConnectionByUserId = async (userId) => {
  try {
    const storage = new SecureStorage();
    const response = await storage.get(getConnectionKey(userId));
    return response;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Create a Connection record in the DB.
 * A connection defines a relation between a monday user and their Github credentials.
 */
export const createConnection = async (attributes) => {
  const { userId, token } = attributes;
  try {
    const storage = new SecureStorage();
    const response = await storage.set(getConnectionKey(userId), { userId, token });

    if (!response) {
      throw new Error('Failed to create connection');
    }

    return { userId, token };
  } catch (err) {
    console.error(err);
  }
};

/**
 * Update an existing Connection.
 */
export const updateConnection = async (updates) => {
  const { userId, token } = updates;
  try {
    const storage = new SecureStorage();
    const response = await storage.set(getConnectionKey(userId), { userId, token });

    if (!response) {
      throw new Error('Failed to update connection');
    }

    return { userId, token };
  } catch (err) {
    console.error(err);
  }
};

/**
 * Delete a connection.
 */
export const deleteConnection = async (userId) => {
  try {
    const storage = new SecureStorage();
    const key = getConnectionKey(userId);
    await storage.delete(key);
    return key;
  } catch (err) {
    console.error(err);
  }
};
