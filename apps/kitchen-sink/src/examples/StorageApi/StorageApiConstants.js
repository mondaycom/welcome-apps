const storageApiConstants = {
  storageApiInstructionsParagraphs: [
    `Use the storage API for quick key-value storage. You can choose to use app-level storage or instance-level storage.`,
    `This example uses instance-level storage, which is great for storing instance-level config or app state.`,
    `If you use app-level storage, multiple features can access the same data.`,
    `You can also access the same storage from the backend by using the apps-sdk package.`,
  ],
  storageApiInstructionslinkToDocumentation: `https://github.com/mondaycom/monday-sdk-js#mondaystorage`,
  storageApiInstructionsListItems: [
    `When the app first renders, it retrieves the current list of favourites using monday.storage.instance.getItem("FAVOURITE_ITEMS")`,
    `Click the heart icon to favourite an item.`,
    `The app will call monday.storage.instance.setItem to set the current list of favourites`,
  ],
  githubUrl: "StorageApi/StorageApi.jsx",
};

export default storageApiConstants;
