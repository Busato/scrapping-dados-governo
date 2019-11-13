const utils = require("../helper/utils.js")
const fs = require('fs')
const fsextra = require('fs-extra')
const sentiment = require('sentiment-ptbr');
;
const crawledPages = new Map()
const arrayOfNews = []

const MAXDEPTH = 0

const Crawl = module.exports = {
    crawl: async (browser, page, writeStream, depth = 0) => {
  
        // Verify subpage depth
        if (depth > MAXDEPTH) {
            return
        }

        // If we've already crawled the URL, we know its children.
        if (crawledPages.has(page.url) /*|| crawledPages.has( new RegExp(page.url))*/) {
          return
        } else {
            // Set page crawled in crawledPages array
            if(utils.allowCrawl(page.url)){
                crawledPages.set(page.url, page)

                utils.writeSiteLog(page.url)

                // Setting new father page
                const newPage = await browser.newPage()
                await newPage.goto(page.url, {waitUntil: 'networkidle2', timeout: 0})
                await newPage.setViewport({width: 320, height: 600})

                //check if jQuery already exists
                //todo verifiar se o jquery existe no site, caso exista, pode haver problemas pra adicionar a tag
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

                currentNews.url = page.url;
                currentNews.title = page.title;

                currentNews.date = await newPage.evaluate((utils) => {
                  let html_date = $("html").text().match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                  let body_date = $("body").text().match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                  let article_date = $("article").text().match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                  //check most valid date
                  let dates = [html_date, body_date, article_date].filter(date => {
                    if(date && date.length > 0)
                      return date
                  });

                  let from = new Date("1/1/2019");
                  let to = new Date((new Date()).setHours(0,0,0))

                  //find the first date that matches the date range between the beginning of the government and now
                  for(let date of dates) {
                    let current_date = new Date(`${date[2]}/${date[1]}/${date[3]}`)
                    if(current_date >= from && current_date <= to)
                      return date[0]
                  }
                  return ""
                });

                currentNews.text = await newPage.evaluate(() => {
                    //cleaning page
                    for(let selector of ['script','noscript', 'style',
                        'img', 'iframe', 'header', 'li', 'ul', 'button',
                        'svg', 'meta', 'audima-div', 'figure', 'footer',
                        'aside', 'form'])
                        document.querySelectorAll(selector).forEach(el => el.outerHTML = "");

                    //add jQuery
                    var s = document.createElement("script");
                    s.type = "text/javascript";
                    s.src = "https://code.jquery.com/jquery-3.2.1.min.js";
                    $("body").append(s);

                    //extract text
                    let text = "";

                    //1) get text from article
                    let stepOneText = "";
                    //article p is always good, so just return it
                    if( $("article p").text().length > 700 )
                        return $("article p").text();
                    //article div may not be good, so we gotta test it
                    else if( $("article div").text().length > 700)
                        stepOneText = $("article div").text();

                    //2) if step 1 doesn't work, extract text elements based on common class names for those elements
                    let stepTwoText = "";
                    let elementsByClass = document.querySelectorAll("p[class*='aragraph'], p[class*='ext'], div[class*='aragraph'], div[class*='ext']")
                    for(let i = 0; i < elementsByClass.length; i++) {
                        if(elementsByClass[i].textContent.length > 280){
                            stepTwoText = stepTwoText.concat(elementsByClass[i].textContent.trim(), " ")
                        }
                    }

                    //3) if step 2 doesn't work, extract all the contents from the body with more than 700 words
                    let stepThreeText = "";
                    let childNodes = $('body').contents()
                    for(let el in childNodes){
                        if(childNodes[el] && !isNaN(el)){
                            if(childNodes[el].textContent && childNodes[el].textContent.split(" ").length > 100){
                                stepThreeText = stepThreeText.concat(childNodes[el].textContent.trim(), " ");
                            }
                            if(childNodes[el].childNodes && childNodes[el].childNodes.length > 0)
                                childNodes = [...childNodes, ...childNodes[el].childNodes]
                        }
                    }

                    //check which extraction was better
                    //TODO word count, if text has <> or {}, pr [], [cadastre-se, assine, acesse, encontre, assinantes], upper case words joinend, words longer than 30 chars (can be joined words)
                    let wordcount1 = stepOneText.split(" ").length;
                    let wordcount2 = stepTwoText.split(" ").length;
                    let wordcount3 = stepThreeText.split(" ").length;
                    if(wordcount1 > wordcount2 && wordcount1 > wordcount3)
                        text = stepOneText
                    if(wordcount2 > wordcount1 && wordcount2 > wordcount3)
                        text = stepTwoText
                    if(wordcount3 > wordcount2 && wordcount3 > wordcount1)
                        text = stepThreeText

                    //removing line breaks, json and html tags
                    return text
                        .replace(/\s\s+/g, " ")
                        .replace(/(\[.*?\])/g, "")
                        .replace(/(\{.*?\})/g, "")
                        .replace(/<\/?[^>]+(>|$)/g, "")
                        .replace(/\r?\n|\r/g, " ")
                        .replace(/<[^>]+>/g, "");
                })

                currentNews.text = utils.removeStopWords(currentNews.text)

                // Sentiment analysis using sentiment-ptbr lib
                // If text wasnt retrieved, score is 0
                currentNews.sentiment = currentNews.text ? sentiment(currentNews.text).score : 0;
                currentNews.category = utils.getCategoryFromText(currentNews.text)
                    ? utils.getCategoryFromText(currentNews.text) : ''

                //fsextra.writeJsonSync('news.json', currentNews, { flag: 'a'});
                // fs.writeFileSync(__dirname + '/../news.json', JSON.stringify(currentNews) +',\n', { flag: 'a'});
                // Write news to file
                writeStream.write(JSON.stringify(currentNews) + ',\n');
                //await utils.appendNewsToJson(currentNews);

                // Push to news array
                arrayOfNews.push(currentNews);

                await newPage.close()
            } else {
                console.log('SEM FAZER CRAWL', page.url);
                for (let i in page.children) {
                    if(!utils.allowCrawl(page.children[i].url)) {
                        console.log('deletando',page.children[i]);
                        delete page.children[i]
                    }
                }
            }
        }

        // Crawl subpages.
        if(page.children){
            for (const childPage of page.children) {
                await Crawl.crawl(browser, childPage, writeStream, depth + 1)
            }
        }
        return arrayOfNews
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
};
