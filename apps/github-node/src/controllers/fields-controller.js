const connectionModelService = require('../services/model-services/connection-model-service');
const githubService = require('../services/github-service');

/**
 * This function returns an array of options to populate a dropdown in the recipe editor. 
 * In this example, it returns a list of Github repositories. 
 * Docs: https://developer.monday.com/apps/docs/custom-fields#list-field-type 
 * @todo (Optional) Define the remote options your blocks need to function. 
 */
async function getRemoteListOptions(req, res) {
  const { userId } = req.session;
  try {
    const { token } = await connectionModelService.getConnectionByUserId(userId);
    const options = await githubService.getRepositories(token);
    return res.status(200).send(options);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

/**
 * This function returns a list of fields that your app supports in dynamic mapping. 
 * Your app can then map data from your product into a monday item (and vice versa). 
 * In this example, the definitions are hardcoded in the '../constants/github.js' file. 
 * Docs: https://developer.monday.com/apps/docs/dynamic-mapping
 * @todo (Optional) Define the mappable fields that your app will support.
 */
async function getFieldDefs(req, res) {
  try {
    const fieldDefs = githubService.getIssueFieldDefs();
    return res.status(200).send(fieldDefs);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

module.exports = {
  getRemoteListOptions,
  getFieldDefs,
};
