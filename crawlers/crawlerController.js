const puppeteer = require('puppeteer')
const crawler = require("./crawler")
const fs = require('fs');

const urlsToCrawl = [
    {url: `https://noticias.uol.com.br/`},
    {url: `https://g1.globo.com/`},
    {url: `https://www.nsctotal.com.br`},
    {url: `https://www.folha.uol.com.br/`}
    ]

const arrayOfNews = {
    news: []
}

module.exports = {
    initiateCrawling: async () => {

        // Initiate Browser 
        const browser = await puppeteer.launch()

        //Open file
        fs.writeFileSync('news.json','[\n', { flag: 'a'});

        console.log(`--------------------------- \n`)
        console.log(`Beginning Scrapper \n`)

        for (const currentUrl of urlsToCrawl) {
            console.log(`Begin Crawler ${currentUrl.url} \n`)
            let currentArrayOfNews = await crawler.crawl(browser, {url: `${currentUrl.url}`})
            console.log(`Ending Crawler ${currentUrl.url} \n`)

            arrayOfNews.news.push(currentArrayOfNews)
        }

        //Close file
        fs.writeFileSync('news.json',']', { flag: 'a'});

        console.log(`Ending Scrapper \n`)
        console.log(`--------------------------- \n`)

        await browser.close()

        return arrayOfNews
    }
}
