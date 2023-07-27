import { getSecret } from './secret-store.js';
import { DEVELOPMENT_ENV } from '../constants/general.js';
import { NODE_ENV } from '../constants/secret-keys.js';

export const getEnv = () => getSecret(NODE_ENV) || DEVELOPMENT_ENV;
export const isDevelopmentEnv = () => getEnv() === DEVELOPMENT_ENV;
