import { Toast, AttentionBox } from 'monday-ui-react-core';
import React from 'react';

function ErrorBox({ title, text }) {
  return (
    <AttentionBox
      title={title}
      text={text}
      type={AttentionBox?.types?.DANGER}
      className="monday-storybook-attention-box_box"
    />
  );
}

function ErrorToast({ errorMessage, errorMessageSetter }) {
  return (
    <Toast
      open={!errorMessage}
      type={Toast?.types?.NEGATIVE}
      onClose={() => errorMessageSetter(false)}
      className="errorDisplayToast"
    >
      {errorMessage}
    </Toast>
  );
}

export { ErrorBox, ErrorToast };
