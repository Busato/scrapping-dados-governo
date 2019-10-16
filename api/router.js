const express = require('express');
const { getSentimentanalysis } = require('./controller/controller')
const router = express.Router();

// Start middleware function
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Starts the root route
router.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

// Starts the number value route
router.get('/analize', getSentimentanalysis);

module.exports = router;
