import dotenv from 'dotenv';
import { isDevelopmentEnv } from './environment';

dotenv.config();

export const getSecret = (secretKey) => {
  if (isDevelopmentEnv()) return secret;
};
