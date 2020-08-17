/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * monday apps framework
 */

var express = require('express'); // Express web server
var request = require('request'); // "Request" library for HTTP requests
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

// If you want to use environment variables, uncomment these lines
// var dotenv = require('dotenv');
// dotenv.config();

var client_id = 'CLIENT_ID'; // Your apps client ID
var client_secret = 'CLIENT_SECRET'; // Your app's secret
var redirect_uri = 'REDIRECT_URI'; // The URI you will send your user to after auth
var port = 8306;

// initialize express server
// and set up cors and cookieParser middleware

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

// Show "Start OAuth Flow" button

app.get('/', function (req, res) {
  res.sendFile('/index.html');
});

// Show final app page
app.get('/finish', function (req, res) {
  res.sendFile('/finish.html', {root: __dirname + '/public'});
});

app.get('/start', function (req, res) {

  var state = 'abcde123456'; // change this to a random string in your implementation
  res.cookie('monday_auth_state', state);

  res.redirect('https://auth.monday.com/oauth2/authorize?' +
    querystring.stringify({
      client_id: client_id,
      redirect_uri: redirect_uri + '/oauth/callback',
      state: state,
      scopes: "me:read boards:read"
    }));
});

app.get('/oauth/callback', function (req, res) {

  // upon callback, your app first checks state parameter
  // if state is valid, we make a new request for access and refresh tokens

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies['monday_auth_state'] : null;

  if (state === null || state !== storedState) {

    res.redirect('/finish?' +
      querystring.stringify({
        error: 'state_does_not_match'
      }));

  } else {

    res.clearCookie('monday_auth_state');
    var authRequest = {
      url: 'https://auth.monday.com/oauth2/token',
      form: {
        redirect_uri: redirect_uri + "/oauth/callback",
        client_id: client_id,
        client_secret: client_secret,
        code: code,
      },
    };

    // POST auth.monday.com/oauth2/token

    request.post(authRequest, function (error, response, body) {

      if (!error && response.statusCode === 200) {

        var jsonBody = JSON.parse(body);
        var accessToken = jsonBody.access_token || null;
        var refreshToken = jsonBody.refresh_token || null;
        var tokenType = jsonBody.token_type || null;
        var scope = jsonBody.scope || null;

        res.redirect("/finish?" +
          querystring.stringify({
            status: 'success',
            access_token: accessToken,
            refresh_token: refreshToken,
            token_type: tokenType,
            scope: scope,
          }));

      } else {
        res.redirect("/finish?" +
          querystring.stringify({
            status: 'failure'
          }));

      }
    });
  }
});

console.log(`Listening on port ${port}`)
app.listen(port);
