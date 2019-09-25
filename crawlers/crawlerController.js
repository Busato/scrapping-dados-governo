const puppeteer = require('puppeteer')
const uolCrawler = require("./crawlerUol")

module.exports = {
    initiateCrawling: async () => {

        // Initiate Browser 
        const browser = await puppeteer.launch();
            
        // Initiate specific crawlers
        await uolCrawler.crawlUOL(browser, {url: `https://noticias.uol.com.br/`})

        await browser.close()
    }
}
