const crawlerController = require("./crawler.js")
const Noticia = require('./noticia.js')

const crawler = crawlerController.createCrawler()

crawler.queue([{
    uri: 'https://noticias.uol.com.br/',
 
    callback: function (error, res, done) {
        if (error) {
            console.log(error)
        } else {
            var $ = res.$
            $('.highlights-headline .row').each((i, element) => {
                const cheerioElement = $(element)

                const thumbImage = cheerioElement.find('.thumb-image')
                const thumbTitle = cheerioElement.find('.thumb-title')
                const text = thumbTitle.text()
                console.log(text)

                // let currentNews = new Noticia(text, )

              })
        }
        done()
    }
}])

crawler.queue([{
    uri: 'https://www.bbc.com/portuguese',
 
    callback: function (error, res, done) {
        if (error) {
            console.log(error)
        } else {
            var $ = res.$
           
        }
        done()
    }
}])

crawler.queue([{
    uri: 'https://www.folha.uol.com.br/',
 
    callback: function (error, res, done) {
        if (error) {
            console.log(error)
        } else {
            var $ = res.$
            
        }
        done()
    }
}])

crawler.queue([{
    uri: 'https://www.nsctotal.com.br',
 
    callback: function (error, res, done) {
        if (error) {
            console.log(error)
        } else {
            var $ = res.$
           
        }
        done()
    }
}])
