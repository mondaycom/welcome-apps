const confirmationConstants = {
  confirmationInstructionsParagraphs: [`Opens a confirmation dialog where the user can select Yes or No.`],
  confirmationInstructionslinkToDocumentation: `https://github.com/mondaycom/monday-sdk-js#mondayexecutetype-params`,
  confirmationInstructionsListItems: [
    `Click the Click me button.`,
    `The app calls 'monday.execute("confirm", options)' with the confirmation message.`,
    `Select an option. The function returns a Promise containing the user's selection.`,
    `Depending on the selection, the app displays an AttentionBox with the user's selection.`,
  ],
  githubUrl: "Confirmation/Confirmation.jsx",
};

export default confirmationConstants;
