const storageApiConstants = {
  storageApiInstructionsParagraphs: [
    `The monday apps infrastructure includes a persistent, key-value database storage that developers can leverage to store data without having to create their own backend and maintain their own database.`,
    `The database currently offers instance-level storage only, meaning that each application instance (i.e. a single board view or a dashboard widget) maintains its own storage. Apps cannot share storage across accounts or even across apps installed in the same location.`,
  ],
  storageApiInstructionslinkToDocumentation: `https://github.com/mondaycom/monday-sdk-js#mondaystorage`,
  storageApiInstructionsListItems: [`Use the monday.storage instance to set and fetch key-value pairs.`],
  githubUrl: "StorageApi/StorageApi.jsx",
};

export default storageApiConstants;
