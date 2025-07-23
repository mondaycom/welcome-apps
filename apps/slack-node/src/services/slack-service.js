const { WebClient } = require('@slack/web-api');
const LoggerService = require('./monday-code/logger-service');

const getChannels = async (token) => {
  const web = new WebClient(token);
  const { channels } = await web.conversations.list({ exclude_archived: true });

  // Create data structure for list field type
  const options = channels.reduce((acc, { id, name }) => {
    acc.push({ value: id, title: name });
    return acc;
  }, []);

  return options;
};

const postMessage = async (token, channel, text) => {
  const web = new WebClient(token);
  const slackResponse = await web.chat.postMessage({
    text,
    channel,
    as_user: true,
  });

  return slackResponse;
};

module.exports = {
  getChannels,
  postMessage,
};
