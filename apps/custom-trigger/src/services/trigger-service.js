const fetch = require('node-fetch');

class TriggerService {

    static async callWebhookUrl(webhookUrl) {
        fetch(webhookUrl, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : process.env.MONDAY_SIGNING_SECRET
            },
            body: JSON.stringify({
                "trigger": {
                  "outputFields": {
                      // nothing to see here folks
                      // but you can put your output fields here if relevant
                  }
                }
              })
        })
    }
  
}

module.exports = TriggerService;
