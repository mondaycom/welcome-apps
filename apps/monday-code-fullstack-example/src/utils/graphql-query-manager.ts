import initMondayClient from 'monday-sdk-js';

import logger from './logger';

// variables are optional and default to an empty object so you can call this like graphQLQueryManager(token, query) or graphQLQueryManager(token, query, variables)
const graphQLQueryManager = async (
  token: string,
  query: string,
  variables: any = {}
) => {
  const mondayClient = initMondayClient();
  mondayClient.setApiVersion('2024-01');
  mondayClient.setToken(token);
  try {
    const response: any = await mondayClient.api(query, { variables });
    if (response.errors) {
      handleError(response.errors);
      return null;
    }

    return response.data;
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    throw new Error(error.message);
  }
};

const handleError = (errors) => {
  // other error handling logic can be added here the twin of this error should be added to error-handler.ts
  errors.forEach((error) => {
    if (error.message.includes('grant access')) {
      throw new Error('reauth');
    }
    logger.error(`Error: ${error.message}`);
  });
};

export { graphQLQueryManager };
