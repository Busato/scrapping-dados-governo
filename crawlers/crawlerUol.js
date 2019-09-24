const URL = 'https://noticias.uol.com.br/'

module.exports = {
    crawlUOL: puppeteer => {
        puppeteer
            .launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
            .then(async browser => {

            const page = await browser.newPage()
            
            // Initiate default browser
            await page.setViewport({width: 320, height: 600})
            await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1')
            await page.goto(URL, {waitUntil: 'networkidle0'})
            await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})

            const result = await page.evaluate(() => {
                try {
                    var data = []
                    const urlArray = []

                    $('.highlights-headline').each(function() {
                        urlArray.push($(this).find('a').attr('href'))
                    })



                    // for (let currentUrl of urlArray) {
                    //     await page.goto(currentUrl)
                    //     await page.waitForNavigation({ waitUntil: 'networkidle' })
                    //     let currentTitle = $(this).find('title').attr('text')

                        // data.push({
                        //     'title' : currentTitle
                        // })

                    // }
                    
                    return urlArray // Return our data array
                } catch(err) {
                    reject(err.toString())
                }
            })
            
            await browser.close()

            console.log(result)

            process.exit()
        }).catch(function(error) {
            console.error('No way Paco!')
            process.exit()
        })
    }
}