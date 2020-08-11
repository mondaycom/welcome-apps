const mondayService = require('../services/monday-service');
const subscriptionModelService = require('../services/subscription-model-service');
const API_TOKEN = process.env.API_TOKEN;

// Function to subscribe to a new integration recipe on a board
async function subscribe(req, res) {
  // Parse webhook URL and ID from payload
  const { webhookUrl, subscriptionId } = req.body.payload;
  console.log(req.body);
  console.log(`The webhook URL is: ${webhookUrl}`);

  // Store subsciption URL and ID in the DB
  // See /services/subscription-model-service.js to learn more about updating the databasse
  try {
    await subscriptionModelService.createSubscription(webhookUrl, subscriptionId);
    return res.status(200).send({webhookId: subscriptionId});
  }
  catch(err) {
    console.log(err);
  }
}

async function unsubscribe(req, res) {
  // TODO: remove subscription ID and URL from DB
  const { webhookId } = req.body.payload;

  try {
    subscriptionModelService.removeSubscription(webhookId);
    return res.status(200).send({result: 'Unsubscribed successfully.'});
  }
  catch(err) {
    console.log(err);
  }
}

module.exports = {
  subscribe,
  unsubscribe
}
