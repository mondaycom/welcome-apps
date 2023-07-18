import fetch from 'node-fetch';
import { getSecret } from '../helpers/secret-store';
import { MONDAY_SIGNING_SECRET } from '../constants/secret-keys';

/**
 * Call a monday webhook URL to trigger the integration.
 * Docs: https://developer.monday.com/apps/docs/custom-trigger#calling-your-action
 */
export const triggerMondayIntegration = async (webhookUrl, data = {}) => {
  await fetch(webhookUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSecret(MONDAY_SIGNING_SECRET),
    },
    body: JSON.stringify({
      trigger: {
        outputFields: {
          ...data,
        },
      },
    }),
  });
};
