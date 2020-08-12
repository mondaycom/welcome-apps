const mondayService = require('../services/monday-service');
const subscriptionModelService = require('../services/subscription-model-service');
const triggerService = require('../services/trigger-service');

function initialize(timeoutInSeconds) {
    setInterval(async () => {
        try {
            await invokeActiveTriggers();
        } catch (error) {
            console.log(error);
        }
    }, timeoutInSeconds * 1000);
}

async function invokeActiveTriggers() {
    try {
        const activeSubscriptions = await subscriptionModelService.getActiveSubscriptions();
        let triggers = activeSubscriptions.map(async (subscription) => {
            const webhookUrl = subscription.dataValues.webhook_url;
            triggerService.callWebhookUrl(webhookUrl);
        });
        return Promise.all(triggers);
        // return activeSubscriptions;   
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    initialize,
    invokeActiveTriggers
  }