export const getSecret = (secretKey) => {
  const secret = process.env[secretKey];

  return secret;
};
