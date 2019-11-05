const express = require('express');
var cors = require('cors');

const app = express();

app.use(cors());

const router = require('./router');

app.use('/', router);

module.exports = app;
