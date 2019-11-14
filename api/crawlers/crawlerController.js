const puppeteer = require('puppeteer')
const crawler = require("./crawler")
const fs = require('fs');

const urlsToCrawl = [
   //{url: `https://noticias.uol.com.br/`},
     //{url: `https://g1.globo.com/`},
    {url: 'https://www1.folha.uol.com.br/'}
   // {url: `https://www.nsctotal.com.br`},
    //{url: `https://gauchazh.clicrbs.com.br`},
    //{url: `https://www.em.com.br/`},
    //{url: `https://www.tribunapr.com.br/`},
    //{url: `https://www.diariodepernambuco.com.br/`},
    //{url: "https://www.facebook.com/share.php?u=https://paranaportal.uol.com.br/politica/bolsonaro-transfere-secretaria-da-cultura-para-a-pasta-do-turismo/&title=Bolsonaro%20transfere%20Secretaria%20da%20Cultura%20para%20a%20pasta%20do%20Turismo"}
]
 
const arrayOfNews = {
    news: []
}

module.exports = {
    initiateCrawling: async (writeStream) => {

        // Initiate Browser 
        const browser = await puppeteer.launch()

        //Open file
        // fs.writeFileSync(__dirname + '/../news.json','[\n', { flag: 'a'});

        console.log(`--------------------------- \n`)
        console.log(`Beginning Scrapper \n`)
        let promises = [];
        for (const currentUrl of urlsToCrawl) {
            console.log(`Begin Crawler ${currentUrl.url} \n`)
            //let currentArrayOfNews = await crawler.crawl(browser, {url: `${currentUrl.url}`})
            promises.push(crawler.crawl(browser, {url: `${currentUrl.url}`}, writeStream)
                .then(value => console.log(`Ending Crawler ${currentUrl.url} \n`))
            );
        }

        await Promise.all(promises)

        //Close file
        // fs.writeFileSync(__dirname + '/../news.json',']', { flag: 'a'});

        console.log(`Ending Scrapper \n`)
        console.log(`--------------------------- \n`)

        await browser.close()

        return arrayOfNews
    }
}
