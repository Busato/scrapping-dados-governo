const utils = require("../helper/utils.js")
const fs = require('fs')
const fsextra = require('fs-extra')
const sentiment = require('sentiment-ptbr');

const crawledPages = new Map()

const MAXDEPTH = 1

const Crawl = module.exports = {
    crawl: async (browser, page, depth = 0) => {
  
        // Verify subpage depth
        if (depth > MAXDEPTH) {
            return
        }

        // If we've already crawled the URL, we know its children.
        if (crawledPages.has(page.url)) {
          return
        } else {
          // Set page crawled in crawledPages array
          crawledPages.set(page.url, page)

          utils.writeSiteLog(page.url)

          // Setting new father page
          const newPage = await browser.newPage()
          await newPage.goto(page.url, {waitUntil: 'networkidle2', timeout: 0})
          await newPage.setViewport({width: 320, height: 600})
          await newPage.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})

          // Get all the children pages and filter them
          let anchors = await newPage.evaluate(collectAllSameOriginAnchorsDeep)

          // Filter so link doesn't point to start url of crawl.
          anchors = anchors.filter(a => a !== page.url) 
            
          // Get only government related news
          anchors = utils.verifiyGovernmentNews(anchors)

          page.title = await newPage.evaluate('document.title')
          page.children = anchors.map(url => ({url}))

          // Get data from current page news
          let currentNews = {}

          currentNews.url = page.url
          currentNews.title = page.title
          currentNews.text = await newPage.evaluate(() => {
            return $("article p").text()
          })

          currentNews.date = await newPage.evaluate((utils) => {
            let date = $("html").text().match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
            return date.length > 0 ? date[0] : ''
          })

          // Sentiment analysis using sentiment-ptbr lib
          // If text wasnt retrieved, score is 0
          currentNews.sentiment = currentNews.text ? sentiment(currentNews.text).score : 0
          currentNews.category = utils.getCategoryFromText(currentNews.text)
            ? utils.getCategoryFromText(currentNews.text) : ''

          //fsextra.writeJsonSync('news.json', currentNews, { flag: 'a'});
          fs.writeFileSync('news.json', JSON.stringify(currentNews) +',\n', { flag: 'a'});
          // Write news to file
          //utils.appendNewsToJson(currentNews);

          // Push to news array
          //arrayOfNews.push(currentNews)

          await newPage.close()
        }
        
        // Crawl subpages.
        for (const childPage of page.children) {
          await Crawl.crawl(browser, childPage, depth + 1)
        }
    }
}

collectAllSameOriginAnchorsDeep = (sameOrigin = false) => {
    const allElements = []
  
    const findAllElements = function(nodes) {
      for (let i = 0, el; el = nodes[i]; ++i) {
        allElements.push(el)
        // If the element has a shadow root, dig deeper.
        if (el.shadowRoot) {
          findAllElements(el.shadowRoot.querySelectorAll('*'))
        }
      }
    }
  
    findAllElements(document.querySelectorAll('*'))
  
    const filtered = allElements
      .filter(el => el.localName === 'a' && el.href) // element is an anchor with an href.
      .filter(el => el.href !== location.href) // link doesn't point to page's own URL.
      .filter(el => {
        if (sameOrigin) {
          return new URL(location).origin === new URL(el.href).origin
        }
        return true
      })
      .map(a => a.href)
      
    return Array.from(new Set(filtered))
}

deepSearch = () => {

}
