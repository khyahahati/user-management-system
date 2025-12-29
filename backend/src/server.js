const http = require('http');
const app = require('./app');
const { env } = require('./config/env');

const port = env.port;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
