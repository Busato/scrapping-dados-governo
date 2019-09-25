// https://github.com/GoogleChromeLabs/puppeteer-examples/blob/master/crawlsite.js

const utils = require("../helper/utils.js")

const crawledPages = new Map()
const arrayOfNews = []
const maxDepth = 1

const Crawl = module.exports = {
    crawlUOL: async (browser, page, depth = 0) => {
  
        console.log(`---------------------------`)
        console.log(`Begin UOL Crawler`)
        // Goes to subpage depth
        if (depth > maxDepth) {
            return;
        }

        // If we've already crawled the URL, we know its children.
        if (crawledPages.has(page.url)) {
        // console.log(`Reusing route: ${page.url}. Continuing`)
          return
        } else {
          console.log(`Loading: ${page.url}`)
      
          // Setting new father page
          const newPage = await browser.newPage()
          await newPage.goto(page.url, {waitUntil: 'networkidle2', timeout: 0})
          await newPage.setViewport({width: 320, height: 600})
          await newPage.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})

          // Get all the children pages and filter them
          let anchors = await newPage.evaluate(collectAllSameOriginAnchorsDeep)
          anchors = anchors.filter(a => a !== page.url) // link doesn't point to start url of crawl.
            
          // Get only government related news
          anchors = utils.verifiyGovernmentNews(anchors)

          page.title = await newPage.evaluate('document.title')
          page.children = anchors.map(url => ({url}))

          // Get data from current page news
          let currentNews = {}

          currentNews.title = page.title
          currentNews.text = await newPage.evaluate(function() {
            return $('.text p').text();
          })
          currentNews.author = await newPage.evaluate(function() {
            return $('.p-author').text();
          })
          currentNews.date = await newPage.evaluate(function() {
            return $('.author .time').text();
          })
          // currentNews.image = 

          currentNews.relatedNews = anchors.map(url => ({url}))
          crawledPages.set(page.url, page) // cache it.
      
          // Push to news array
          arrayOfNews.push(currentNews)

          await newPage.close()
        }
        
        // Crawl subpages.
        for (const childPage of page.children) {
          await Crawl.crawlUOL(browser, childPage, depth + 1)
        }

        console.log(`Ending UOL Crawler`)
        console.log(`---------------------------`)

        return arrayOfNews
    }
}

collectAllSameOriginAnchorsDeep = (sameOrigin = true) => {
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
