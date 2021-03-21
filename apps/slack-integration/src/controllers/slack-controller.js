const {WebClient} = require('@slack/web-api');
const subscriptionsService = require('../services/subscriptions-service');
const triggersService = require('../services/triggers-service');
const tokensService = require('../services/tokens-service');
const mondayService = require('../services/monday-service');

async function subscribe(req, res) {
  const {webhookUrl, subscriptionId, inputFields} = req.body.payload;
  const {groupId} = inputFields
  try {
    // Store webhook for trigger calls
    await subscriptionsService.createSubscription(webhookUrl, subscriptionId, groupId);
    return res.status(200).send({webhookId: subscriptionId});
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: 'internal server error', err});
  }
}

async function unsubscribe(req, res) {
  const {webhookId} = req.body.payload;

  try {
    // Remove webhook
    await subscriptionsService.removeSubscription(webhookId);
    return res.status(200).send({result: 'Unsubscribed successfully.'});
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: 'internal server error', err});
  }
}

async function trigger(req, res) {
  try {
    const {text} = req.body
    // Stop of text was not provided
    if (!text) return res.status(400).send("missing item text")

    // Get all active subscriptions
    const activeSubscriptions = await subscriptionsService.getActiveSubscriptions();
    const triggers = activeSubscriptions.map(async ({dataValues}) => {
      const {webhookUrl, groupId} = dataValues;
      // Create data structure for the webhook
      const itemColumnValues = mondayService.createItemColumnValues(text, groupId)
      return triggersService.callWebhook(webhookUrl, {itemColumnValues});
    });
    await Promise.all(triggers);
    // Notify slack that triggers where successful
    res.status(200).send("item created 😊")
  } catch (err) {
    console.log(err);
  }
}

async function action(req, res) {
  const {payload} = req.body;
  const {shortLivedToken, userId} = req.session;
  const {inboundFieldValues} = payload;
  const {itemId, extraMessage, slackChannel, columnId} = inboundFieldValues;

  // Get relevant item status label from the board
  try {
    const statusLabel = await mondayService.getColumnValue(shortLivedToken, itemId, columnId);
    const accessToken = await tokensService.getTokenByUserId(userId)

    // Send message to slack
    const web = new WebClient(accessToken);
    const slackResponse = await web.chat.postMessage({
      text: `message: ${extraMessage}; status: ${statusLabel}`,
      channel: slackChannel.value
    })
    return res.status(200).send(slackResponse);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ errorMessage: "failed in sending a message to slack", err });
  }
}

async function channels(req, res) {
  const {userId} = req.session;
  try {
    const accessToken = await tokensService.getTokenByUserId(userId)

    // Get accessible slack channels
    const web = new WebClient(accessToken);
    const {channels} = await web.conversations.list({exclude_archived: true})

    // Create data structure for list field type
    const options = channels.reduce((acc, {id, name}) => {
      acc.push({value: id, title: name})
      return acc
    }, []);

    // return populated options to monday.com
    return res.status(200).send(options);
  } catch (err) {
    console.log(err);
    return res.status(404).send({errorMessage: "channel not found"});
  }
}

module.exports = {
  subscribe,
  unsubscribe,
  trigger,
  action,
  channels
};
