import axios from 'axios';
import mondaySdk from 'monday-sdk-js';

const monday = mondaySdk();

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // add if blocks for each error code you want to handle
    // might want to refactor if you need it to change state like add a global error state
    if (
      error.response.status === 401 &&
      error.response.data.message === 'Reauthentication required'
    ) {
      // this wont really run locally because of the context, location, and token
      // but it will work in the monday app
      // you may need to comment out for local or add a check for local TODO
      const context = await monday.get('context');
      const location = await monday.get('location');
      const token = await monday.get('sessionToken');

      const CLIENT_ID = context.data.app.clientId;
      const ACCOUNT_SLUG = location.data.href
        .split('https://')[1]
        .split('.monday')[0];

      const LIVE_URL = await axiosInstance
        .get('/live-url')
        .then((res) => res.data.url);

      let oAuthUrl = `https://auth.monday.com/oauth2/authorize?client_id=${CLIENT_ID}&subdomain=${ACCOUNT_SLUG}&redirect_uri=${LIVE_URL}/oauth/callback&state=${encodeURIComponent(
        token.data
      )}`;
      window.location.href = oAuthUrl;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
