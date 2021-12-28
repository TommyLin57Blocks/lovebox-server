// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
const path = require('path');

// const args = process.argv || [];
// const test = args.some(arg => arg.includes('jasmine'));
var allowInsecureHTTP = true;

const databaseUri = 'mongodb://lovebox_tom:Nono_1893_lovebox@127.0.0.1:27017/lovebox';

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}
const config = {
  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'lovebox',
  masterKey: process.env.MASTER_KEY || 'AFB14B35940A2A424D5FBF8D80ADED5C', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse', // Don't forget to change to https if needed
  liveQuery: {
    classNames: ['Posts', 'Comments'], // List of classes to support for query subscriptions
  },
};
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

const app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
const api = new ParseServer(config);
app.use(mountPath, api);

var dashboard = new ParseDashboard({
  apps: [
    {
      appId: process.env.APP_ID || 'lovebox',
      masterKey:  'AFB14B35940A2A424D5FBF8D80ADED5C',
      serverURL:  'http://101.42.233.54:1337/parse',
      appName: process.env.APP_NAME || 'Lovebox'
    }
  ],
  users: 
  [
    {
        user:"tom",
        pass:"Nono1893"
    }
  ]
},{allowInsecureHTTP:true});

app.use('/dash', dashboard);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

const port = process.env.PORT || 1337;
const httpServer = require('http').createServer(app);
httpServer.listen(port, function () {
    console.log('parse-server-example running on port ' + port + '.');
});
  // This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

module.exports = {
  app,
  config,
};
