const handler = require('../handler/handler');
const crawlerController = require("../crawlers/crawlerController.js")
const fs = require('fs')

const getSentimentanalysis = async (req, res) => {
  let stream = fs.createWriteStream('api/news.json');
  stream.write("[");

  try {
    const convertedNewsJson = await crawlerController.initiateCrawling(stream)
    stream.write("]");
    stream.close();
    return handler.onRequestSuccess(res, convertedNewsJson);
  } catch (error) {
    stream.write("]");
    stream.close();
    return handler.onRequestError(res, error);
  }

};

module.exports = {
  getSentimentanalysis,
};
