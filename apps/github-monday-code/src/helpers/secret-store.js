import dotenv from 'dotenv';

dotenv.config();


export const getSecret = (secretKey) => {
  const secret = process.env[secretKey];
  return secret;
};
