const fetch = require('node-fetch');

/**
 * Call a monday webhook URL to trigger the integration.
 * Docs: https://developer.monday.com/apps/docs/custom-trigger#calling-your-action
 */
const triggerMondayIntegration = async (webhookUrl, data = {}) => {
  fetch(webhookUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.MONDAY_SIGNING_SECRET,
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

module.exports = { triggerMondayIntegration };
