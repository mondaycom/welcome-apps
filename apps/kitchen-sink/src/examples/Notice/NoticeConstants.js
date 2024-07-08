const noticeConstants = {
  notices: [
    {
      text: "Success",
      type: "success",
      color: "positive",
    },
    {
      text: "Info",
      type: "info",
      color: "primary",
    },
    {
      text: "Error",
      type: "error",
      color: "negative",
    },
  ],
  noticeInstructionsParagraphs: [
    `Display a message at the top of the user's page. Usefull for success, error & general messages.`,
  ],
  noticeInstructionslinkToDocumentation: `https://github.com/mondaycom/monday-sdk-js#mondayexecutetype-params`,
  noticeInstructionsListItems: [
    `Call execute Monday's sdk method with "notice" parameter sending the message content, type of notice and timeout.`,
  ],
  githubUrl: "Notice/Notice.jsx",
};

export default noticeConstants;
