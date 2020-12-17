const fetch = require('node-fetch');

const callWebhook = async (webhookUrl, data = {}) => {
  try {
    return await fetch(webhookUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.MONDAY_SIGNING_SECRET
      },
      body: JSON.stringify({
        trigger: {
          outputFields: {
            ...data
          }
        }
      })
    });
  } catch (err) {
    console.log(err)
  }
};


module.exports = { callWebhook };
