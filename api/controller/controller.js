const handler = require('../handler/handler');
const crawlerController = require("../../crawlers/crawlerController.js")

const getSentimentanalysis = async (req, res) => {
  try {
    const convertedNewsJson = await crawlerController.initiateCrawling()

    return handler.onRequestSuccess(res, convertedNewsJson);
  } catch (error) {
    return handler.onRequestError(res, error);
  }
};

module.exports = {
  getSentimentanalysis,
};
