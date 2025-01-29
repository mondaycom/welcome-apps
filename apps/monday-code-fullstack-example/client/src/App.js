import { useState, useEffect } from 'react';
import React from 'react';
import './App.css';

import mondaySdk from 'monday-sdk-js';
import 'monday-ui-react-core/dist/main.css';
import axios from 'axios';

import OAuthRedirect from './utility/oauthRedirect';
import { ErrorBox } from './utility/ErrorDisplay';

const monday = mondaySdk();
const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [auth, setAuth] = useState(false);
  const [authError, setAuthError] = useState(false);

  // There is an Axios interceptor in the axios.js file that will handle the reauthentication
  // Use this axiosInstance to make all API calls to the backend like find all boards, create a new item, etc.
  // the reason is if the token is updated for more pemissions, or the token is expired, the interceptor will handle it
  // forcing a reauthentication that will give them the updated access this will only pop the error from the FE
  // from monday boards or items, the backend will still need to handle the reauthentication and there is nothing written to handle that case for oauth
  // but if you use the backend auth where it decodes for a monday board it will automatically reauthenticate/work
  // note monday will automatically notify the user that that the permissions have updated in a FE, this is just more aggressive
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const sessionToken = await monday.get('sessionToken');
        const context = await monday.get('context');
        const response = await axios.post(
          '/api/monday/oauth-flow',
          {
            context: context,
          },
          {
            headers: {
              authorization: sessionToken.data,
            },
          }
        );

        const authCheck = response.data.authenticated;
        if (authCheck) {
          setAuth(true);
        } else {
          setAuth(false);
        }
        setLoaded(true);
      } catch (error) {
        console.error(error);
        setAuth(false);
        setAuthError(error.stack);
      }
    };
    checkAuth();
  }, []);

  if (!loaded) {
    return (
      <div className="App">
        {authError ? (
          <div className="errorDisplayForm">
            <ErrorBox title="Authentication Check Failed" text={authError} />
          </div>
        ) : (
          <div className="groupSortForm">Loading app...</div>
        )}
      </div>
    );
  }

  return (
    <div className="App">
      {auth ? <p>Base Component Goes Here</p> : <OAuthRedirect />}
    </div>
  );
};
export default App;
