import ConnectionStorage from '../../storage/connection-storage.js';

const connectionStorage = new ConnectionStorage();

/**
 * Retrieve a Github connection based on a monday user ID.
 * @returns A Github OAuth token associated with the user.
 */
export const getConnectionByUserId = async (userId) => {
  try {
    const response = await connectionStorage.get(userId);
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
    const response = await connectionStorage.set(userId, { userId, token });

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
    const response = await connectionStorage.set(userId, { userId, token });

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
    await connectionStorage.delete(userId);
    return key;
  } catch (err) {
    console.error(err);
  }
};
