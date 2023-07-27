import * as connectionModelService from '../services/model-services/connection-model-service.js';
import * as githubService from '../services/github-service.js';
import logger from '../services/logger/index.js';

const TAG = 'action_controller';
/**
 * This function runs when your action block is called from monday.
 * In this example, it creates an issue in Github.
 * Docs: https://developer.monday.com/apps/docs/custom-actions
 * @param req The POST request from monday, which contains the block's input fields.
 * @todo Update this to interact with your product's API instead of Github.
 */
export async function executeAction(req, res) {
  const { accountId, userId } = req.session;
  const { inputFields } = req.body.payload;

  // Gets the blocks' required data from the input fields object.
  // You can define the input fields for your block by opening your integration feature and selecting Feature Details > Workflow Blocks
  // Input fields docs: https://developer.monday.com/apps/docs/custom-actions#configure-action-input-fields
  const { repository, issue } = inputFields;
  const loggingOptions = { accountId, userId, repository, issue };

  logger.info('create issue action received', TAG, loggingOptions);

  try {
    // Retrieve the relevant user's OAuth token from the DB
    const { token } = await connectionModelService.getConnectionByUserId(userId);
    const owner = repository.value.owner;
    const repo = repository.value.name;

    // Call the Github API to create an issue.
    await githubService.createIssue(token, owner, repo, issue);

    return res.status(200).send();
  } catch (err) {
    logger.error('create issue action failed', TAG, { ...loggingOptions, error: err });
    return res.status(500).send({ message: 'internal server error' });
  }
}
