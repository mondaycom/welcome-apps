import { SecureStorage } from '@mondaycom/apps-sdk';
import logger from './logger';

const secureStorage = new SecureStorage();

const secureStorageSet = async (key: string, value: unknown): Promise<void> => {
  try {
    const stringed = typeof value === 'string' ? value : JSON.stringify(value);
    await secureStorage.set(key, stringed);
  } catch (error) {
    logger.error(`Error setting item with key ${key}:`, {
      error: error as Error,
    });
    throw new Error(`Failed to set item with key ${key}`);
  }
};

const secureStorageGet = async (key: string): Promise<unknown> => {
  try {
    const response: any = await secureStorage.get(key);
    return typeof response === 'string' ? response : JSON.parse(response);
  } catch (error) {
    logger.error(`Error getting item with key ${key}:`, {
      error: error as Error,
    });
    throw new Error(`Failed to get item with key ${key}`);
  }
};

const secureStorageDelete = async (key: string): Promise<void> => {
  try {
    await secureStorage.delete(key);
  } catch (error) {
    logger.error(`Error deleting item with key ${key}:`, {
      error: error as Error,
    });
    throw new Error(`Failed to delete item with key ${key}`);
  }
};

export { secureStorageSet, secureStorageGet, secureStorageDelete };
