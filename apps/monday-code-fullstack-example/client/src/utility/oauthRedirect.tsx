import React, { useEffect } from 'react';
import mondaySdk from 'monday-sdk-js';
import axios from 'axios';
const monday = mondaySdk();

const OAuthRedirect = () => {
  const initiateOAuth = async () => {
    const context = await monday.get('context');
    const location = await monday.get('location');
    const token = await monday.get('sessionToken');

    const CLIENT_ID = context.data.app.clientId;
    const ACCOUNT_SLUG = location.data.href
      .split('https://')[1]
      .split('.monday')[0];

    const LIVE_URL = await axios.get('/live-url').then((res) => res.data.url);

    let oAuthUrl = `https://auth.monday.com/oauth2/authorize?client_id=${CLIENT_ID}&subdomain=${ACCOUNT_SLUG}&redirect_uri=${LIVE_URL}/oauth/callback&state=${encodeURIComponent(
      token.data
    )}`;
    window.location.href = oAuthUrl;
  };

  useEffect(() => {
    initiateOAuth();
  }, []);

  return (
    <div className="groupSortForm">
      <p>Loading Authentication Page...</p>
    </div>
  );
};

export default OAuthRedirect;
