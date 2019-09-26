const fs = require('fs')

const arrayFilteredWords = 
[ 
    'governo',
    'bolsonaro',
    'guedes',
    'politica',
    'congresso',
    'ministro',
    'stf',
    'presidente',
    'moro'
]

module.exports = {
    verifiyGovernmentNews: (arrayLinks) => {
        let arraLinksFiltered = []

        arrayLinks.map(currentLink => {
            arrayFilteredWords.map(filteredWord => {
                if (currentLink.includes(filteredWord)) {
                    arraLinksFiltered.push(currentLink)
                }
            })       
        })

        return arraLinksFiltered
    },

    appendNewsToJson: arrayOfNews => {
        fs.writeFile('news.json', JSON.stringify(arrayOfNews, null, 2), (err) => {
            if (err) console.error(err)
            console.log('Data written to file \n')
        })
    },

    writeSiteLog: url => {
        fs.appendFile('site-log.txt', `Visited: ${url} \n`, (err) => {
          if (err) console.error(err)
        })
    }      
}
