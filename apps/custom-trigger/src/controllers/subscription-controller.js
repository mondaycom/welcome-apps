const subscriptionModelService = require('../services/subscription-model-service');

// Function to subscribe to a new integration recipe on a board
async function subscribe(req, res) {
  // Parse webhook URL and ID from payload
  const { webhookUrl, subscriptionId } = req.body.payload;
  console.log(`A new subscription was added. The webhook URL is: ${webhookUrl}`);

  // Store subsciption URL and ID in the DB
  // See /services/subscription-model-service.js to learn more about updating the databasse
  try {
    await subscriptionModelService.createSubscription(webhookUrl, subscriptionId);
    return res.status(200).send({webhookId: subscriptionId});
  }
  catch(err) {
    return res.status(500).send("Subscription could not be created.");
    console.log(err);
  }
}

async function unsubscribe(req, res) {
  // TODO: remove subscription from DB
  const { webhookId } = req.body.payload;

  try {
    await subscriptionModelService.removeSubscription(webhookId);
    return res.status(200).send({result: 'Unsubscribed successfully.'});
  }
  catch(err) {
    return res.status(500).send("Subscription could not be removed.");
    console.log(err);
  }
}

module.exports = {
  subscribe,
  unsubscribe
}
