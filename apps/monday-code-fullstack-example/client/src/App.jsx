import { useState, useEffect } from "react";
import React from "react";
import "./App.css";

import mondaySdk from "monday-sdk-js";
import axios from "axios";

import OAuthRedirect from "./utility/oauthRedirect";
import { ErrorBox } from "./utility/ErrorDisplay";

const monday = mondaySdk();

// There is an Axios interceptor in the axios.js file that will handle the reauthentication
// Use this axiosInstance to make all API calls to the backend like find all boards, create a new item, etc.
// the reason is if the token is updated for more pemissions, or the token is expired, the interceptor will handle it
// forcing a reauthentication that will give them the updated access this will only pop the error from the FE
// from monday boards or items, the backend will still need to handle the reauthentication and there is nothing written to handle that case for oauth
// but if you use the backend auth where it decodes for a monday board it will automatically reauthenticate/work
// note monday will automatically notify the user that that the permissions have updated in a FE, this is just more aggressive

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const [sessionToken, context] = await Promise.all([
          monday.get("sessionToken"),
          monday.get("context")
        ]);

        const { data } = await axios.post("/api/monday/oauth-flow", 
          { context: context },
          { headers: { authorization: sessionToken.data } }
        );

        setIsAuthenticated(data.authenticated);
      } catch (err) {
        setError(err.stack);
      } finally {
        setIsLoading(false);
      }
    };

    authenticate();
  }, []);

  if (isLoading) {
    return (
      <div className="App">
        {error ? (
          <div className="errorDisplayForm">
            <ErrorBox title="Authentication Check Failed" text={error} />
          </div>
        ) : (
          <div className="groupSortForm">Loading app...</div>
        )}
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated ? <p>Base Component Goes Here</p> : <OAuthRedirect />}
    </div>
  );
};

export default App;
