const workingWithSettingsConstants = {
  DEFAULT_SETTINGS_VALUES: {
    titleContent: "Working With Settings",
    actionDescription: "Use settings to change the UI and logic accordingly",
    toDisplayCards: true,
  },
  workingWithSettingsInstructionsParagraphs: [``],
  workingWithSettingsInstructionslinkToDocumentation: `https://apps.developer.monday.com/docs/quickstart-view#part-3-use-settings-to-let-the-user-customize-their-experience`,
  workingWithSettingsInstructionsListItems: [
    `Open your app's feature. Open the "View Setup" (or "Widget Setup") pane.`,
    `On the "View Settings" pane on the right, select the blue "Add Field" button. This will let you add a new field to your feature's settings.`,
    `Click done, and save.`,
    `Use Monday sdk listen method with "settings" parameter to listen for changes. save the settings in local state and change your application accordingly.`,
  ],
  githubUrl: "WorkingWithSettings/WorkingWithSettings.jsx",
};

export default workingWithSettingsConstants;
