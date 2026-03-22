import React from 'react';
import './ErrorDisplay.css';

interface ErrorBoxProps {
  title: string;
  text: string;
}

interface ErrorToastProps {
  errorMessage: string;
  errorMessageSetter: (value: boolean) => void;
}

function ErrorBox({ title, text }: ErrorBoxProps) {
  return (
    <div className="error-box">
      <h3 className="error-box-title">{title}</h3>
      <p className="error-box-text">{text}</p>
    </div>
  );
}

function ErrorToast({ errorMessage, errorMessageSetter }: ErrorToastProps) {
  return (
    <div className={`error-toast ${errorMessage ? 'show' : ''}`}>
      <div className="error-toast-content">
        <span>{errorMessage}</span>
        <button 
          className="error-toast-close"
          onClick={() => errorMessageSetter(false)}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export { ErrorBox, ErrorToast };
