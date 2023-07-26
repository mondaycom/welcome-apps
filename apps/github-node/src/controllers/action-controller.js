const connectionModelService = require('../services/model-services/connection-model-service');
const githubService = require('../services/github-service');

/**
 * This function runs when your action block is called from monday. 
 * In this example, it creates an issue in Github. 
 * Docs: https://developer.monday.com/apps/docs/custom-actions
 * @param req The POST request from monday, which contains the block's input fields.
 * @todo Update this to interact with your product's API instead of Github.
 */
async function executeAction(req, res) {
  const { userId } = req.session;
  const { inputFields } = req.body.payload;

  try {
    // Retrieve the relevant user's OAuth token from the DB
    const { token } = await connectionModelService.getConnectionByUserId(userId);

    // Gets the blocks' required data from the input fields object.
    // You can define the input fields for your block by opening your integration feature and selecting Feature Details > Workflow Blocks
    // Input fields docs: https://developer.monday.com/apps/docs/custom-actions#configure-action-input-fields
    const { repository, issue } = inputFields;
    const owner = repository.value.owner;
    const repo = repository.value.name;

    // Call the Github API to create an issue.
    await githubService.createIssue(token, owner, repo, issue);

    return res.status(200).send();
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

module.exports = {
  executeAction,
}