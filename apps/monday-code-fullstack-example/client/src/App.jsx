import { useState, useEffect } from "react";
import React from "react";
import "./App.css";

import mondaySdk from "monday-sdk-js";
import axios from "axios";

import OAuthRedirect from "./utility/oauthRedirect";
import { ErrorBox } from "./utility/ErrorDisplay";

const monday = mondaySdk();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        // Always send the session token to the backend to check if the user is authenticated via the client auth middleware
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
