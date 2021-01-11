const fetch = require('node-fetch');

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
