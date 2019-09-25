const puppeteer = require('puppeteer')
const uolCrawler = require("./crawlerUol")
const fs = require('fs')

module.exports = {
    initiateCrawling: async () => {

        // Initiate Browser 
        const browser = await puppeteer.launch();
            
        // Initiate specific crawlers
        let arrayOfNewsUol = await uolCrawler.crawlUOL(browser, {url: `https://noticias.uol.com.br/`})

        const arrayOfNews = {
            table: []
        }

        arrayOfNews.table.push(arrayOfNewsUol)

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
