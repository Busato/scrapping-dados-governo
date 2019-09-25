// https://github.com/GoogleChromeLabs/puppeteer-examples/blob/master/crawlsite.js

const crawledPages = new Map()
const arrayOfNews = []

const Crawl = module.exports = {
    crawlUOL: async (browser, page) => {
  
        // If we've already crawled the URL, we know its children.
        if (crawledPages.has(page.url)) {
          console.log(`Reusing route: ${page.url}`);
    
          const item = crawledPages.get(page.url);
          console.log(item)
          page.title = item.title;
          page.img = item.img;
          page.children = item.children;
          // Fill in the children with details (if they already exist).
          page.children.forEach(c => {
            const item = crawledPages.get(c.url);
            c.title = item ? item.title : '';
            c.img = item ? item.img : null;
          });
          return;
        } else {
          console.log(`Loading: ${page.url}`);
      
          // Setting new father page
          const newPage = await browser.newPage();
          await newPage.goto(page.url, {waitUntil: 'networkidle2'});
          await newPage.setViewport({width: 320, height: 600})
          await newPage.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})

          // Get all the children pages and filter them
          let anchors = await newPage.evaluate(collectAllSameOriginAnchorsDeep);
          anchors = anchors.filter(a => a !== page.url) // link doesn't point to start url of crawl.
            
          console.log(anchors)
          page.title = await newPage.evaluate('document.title');
          page.children = anchors.map(url => ({url}));
      
          crawledPages.set(page.url, page); // cache it.
      
          await newPage.close();
        }
        
        // Crawl subpages.
        for (const childPage of page.children) {
          await Crawl.crawlUOL(browser, childPage);
        }

      }
}


   collectAllSubPages = () => {
    const allElements = [];
  
    $('.highlights-headline .row').each(function() {
        let currentLink = $(this).find('a').attr('href')

        allElements.push(currentLink)
    })
    
    return Array.from(new Set(allElements));
  }


  function collectAllSameOriginAnchorsDeep(sameOrigin = true) {
    const allElements = [];
  
    const findAllElements = function(nodes) {
      for (let i = 0, el; el = nodes[i]; ++i) {
        allElements.push(el);
        // If the element has a shadow root, dig deeper.
        if (el.shadowRoot) {
          findAllElements(el.shadowRoot.querySelectorAll('*'));
        }
      }
    };
  
    findAllElements(document.querySelectorAll('*'));
  
    const filtered = allElements
      .filter(el => el.localName === 'a' && el.href) // element is an anchor with an href.
      .filter(el => el.href !== location.href) // link doesn't point to page's own URL.
      .filter(el => {
        if (sameOrigin) {
          return new URL(location).origin === new URL(el.href).origin;
        }
        return true;
      })
      .map(a => a.href);
  
    return Array.from(new Set(filtered));
  }