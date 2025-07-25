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
    return {token: connection};
  } catch (err) {
    LoggerService.getInstance().error('Error getting connection by user ID', err);
  }
};

const createConnection = async (attributes) => {
  const { userId, token } = attributes;
  try {
    const key = generateTokenKey(userId);
    const storageService = SecureStorageService.getInstance();
    await storageService.set(key, token);
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