const http = require('http');
const createApp = require('github-app');
const createHandler = require('github-webhook-handler');
const pullRequestHandler = require('./pull_requests');

const handler = createHandler({
  path: '/events',
  secret: process.env.WEBHOOK_SECRET,
});

const app = createApp({
  id: process.env.APP_ID,
  cert: Buffer.from(process.env.GITHUB_PRIVATE_KEY, 'base64').toString(),
});

http
  .createServer(function(req, res) {
    handler(req, res, function(err) {
      res.statusCode = 404;
      res.end('no such location');
    });
  })
  .listen(process.env.PORT, () => {
    console.log('STARTED');
  });

handler.on('pull_request', pullRequestHandler(app));
