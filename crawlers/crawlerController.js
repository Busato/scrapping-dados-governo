const puppeteer = require('puppeteer')
const uolCrawler = require("./crawlerUol")

module.exports = {
    initiateCrawling: () => {
        // Initiate specific crawlers
        uolCrawler.crawlUOL(puppeteer)
    }
}
