require('dotenv').config();

const http = require('http');

const index = require('./api/app');

const PORT = process.env.PORT || 3000;

const server = http.createServer(index);

server.listen(PORT);

module.exports = server;
