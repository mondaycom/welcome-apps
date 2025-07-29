// Helper functions if you want to implement OAuth in Slack from scratch, instead of using the Credentials App Feature which handles it for you. const { AuthorizationCode } = require('simple-oauth2');
const SecureStorageService = require('../monday-code/secure-storage-service');
const LoggerService = require('../monday-code/logger-service');
const { Logger } = require('@mondaycom/apps-sdk');

const generateTokenKey = (userId) => {
  return `token:${userId}`;
};
const getConnectionByUserId = async (userId) => {
  try {
    const key = generateTokenKey(userId);
    const storageService = SecureStorageService.getInstance();
    const connection = await storageService.get(key);
    return { token: connection };
  } catch (err) {
    LoggerService.getInstance().error('Error getting connection by user ID', err);
  }
};

const createConnection = async (attributes) => {
  try {
    const { userId, botToken, userToken, teamId, teamName } = attributes;

    const token = botToken || userToken;

    if (!token) {
      throw new Error('No valid token provided (neither botToken nor userToken)');
    }

    // Check if connection already exists and update it
    const existingConnection = await getConnectionByUserId(userId);

    let connection;
    if (existingConnection) {
      connection = await updateConnection({ userId, token });
    } else {
      const key = generateTokenKey(userId);
      const storageService = SecureStorageService.getInstance();
      await storageService.set(key, token);
    }

    return connection;
  } catch (err) {
    LoggerService.getInstance().error('Error creating connection', err);
  }
};

const updateConnection = async (updates) => {
  const { userId, token } = updates;
  try {
    const key = generateTokenKey(userId);
    const storageService = SecureStorageService.getInstance();
    const connection = await storageService.set(key, token);
    return connection;
  } catch (err) {
    LoggerService.getInstance().error('Error updating connection', err);
  }
};

const deleteConnection = async (userId) => {
  try {
    const tokenToDelete = generateTokenKey(userId);
    const storageService = SecureStorageService.getInstance();
    await storageService.delete(tokenToDelete);
    return userId;
  } catch (err) {
    LoggerService.getInstance().error('Error deleting connection', err);
  }
};

module.exports = {
  getConnectionByUserId,
  createConnection,
  updateConnection,
  deleteConnection,
};
