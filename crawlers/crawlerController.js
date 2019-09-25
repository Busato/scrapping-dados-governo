const puppeteer = require('puppeteer')
const uolCrawler = require("./crawlerUol")
const fs = require('fs')

const arrayOfNews = {
    news: []
}

module.exports = {
    initiateCrawling: async () => {

        // Initiate Browser 
        const browser = await puppeteer.launch();
          
        // Initiate specific crawlers
        console.log(`---------------------------`)
        console.log(`Begin UOL Crawler`)
        let arrayOfNewsUol = await uolCrawler.crawlUOL(browser, {url: `https://noticias.uol.com.br/`})
        arrayOfNews.news.push(arrayOfNewsUol)
        console.log(`Ending UOL Crawler`)
        console.log(`---------------------------`)

        appendNewsToJson(arrayOfNews)

        await browser.close()
    }
}

appendNewsToJson = arrayOfNews => {
    fs.writeFile('news.json', JSON.stringify(arrayOfNews, null, 2), (err) => {
        if (err) console.error(err)
        console.log('Data written to file')
    })
}
