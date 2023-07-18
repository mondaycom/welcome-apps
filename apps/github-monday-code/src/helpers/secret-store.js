export const getSecret = (secretKey) => {
  const secret = process.env[secretKey];

  if (!secret) {
    throw new Error(`could not get ${secretKey} secret`);
  }
  return secret;
};
